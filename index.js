import {
    api,
    master,
    custodian,
    auditor,
    manager,
    issuer,
    investor1,
    investor2,
    investor3,
    superissuer
} from './init.js'

const BLOCK_INTERVAL = 20000;
// everusd to account balance translation 
const UNIT = 1000000000;
// scenario1 bonds
const BOND1 = "ECBD101";
const BOND2 = "ECBD102";
const BOND3 = "ECBD103";
const BOND4 = "ECBD104";
const BOND5 = "ECBD105";
// scenario2 bond
const BOND10 = "ECBDSC8";

// account roles
const MASTER_ROLE = 1;
const CUSTODIAN_ROLE = 2;
const ISSUER_ROLE = 4;
const INVESTOR_ROLE = 8;
const AUDITOR_ROLE = 16;
const MANAGER_ROLE = 32;

const accounts = [
    master,
    custodian,
    auditor,
    manager,
    issuer,
    investor1,
    investor2,
    investor3,
    superissuer
];

for (let account of accounts) {
    console.log(`account ${account.meta.name} has address ${account.address}`);
}

function get_bond(day, price) {
    return {
        "docs_pack_root_hash_main": [0],
        "docs_pack_root_hash_legal": [0],
        "docs_pack_root_hash_finance": [0],
        "docs_pack_root_hash_tech": [0],

        "impact_data_type": "POWER_GENERATED",
        "impact_data_baseline": [4000, 5000, 5000, 6000, 6000, 6000, 6000, 6000, 6000, 7000, 8000, 8000],
        "impact_data_max_deviation_cap": 16000,
        "impact_data_max_deviation_floor": 4000,
        "impact_data_send_period": day,
        "interest_rate_penalty_for_missed_report": 2000,
        "interest_rate_base_value": 3000,
        "interest_rate_margin_cap": 5000,
        "interest_rate_margin_floor": 1000,
        "interest_rate_start_period_value": 1000,
        "interest_pay_period": day,
        "start_period": 2 * day,
        "payment_period": 2 * day,
        "bond_duration": 12,
        "bond_finishing_period": 100 * day,
        "mincap_deadline": 0,
        "bond_units_mincap_amount": 100,
        "bond_units_maxcap_amount": 600,
        "bond_units_base_price": price * UNIT
    }
}

async function scenario1() {
    let now = await api.now();
    await api.wait_until(0);
    const everusd = 2000;

    await api.mint(investor1, custodian, everusd * UNIT);
    await api.mint(investor2, custodian, everusd * UNIT);
    await api.mint(investor3, custodian, everusd * UNIT);

    console.log(`each investor has minted ${everusd} everusd`);

    const bond1 = get_bond(api.day_duration, 10);
    await api.wait_until(0);

    await api.prepare_bond(issuer, BOND1, bond1);
    await api.prepare_bond(issuer, BOND2, bond1);
    await api.prepare_bond(issuer, BOND3, bond1);
    await api.prepare_bond(issuer, BOND4, bond1);
    await api.prepare_bond(issuer, BOND5, bond1);

    console.log(`'${BOND1}' '${BOND2}' '${BOND3}' '${BOND4}' '${BOND5}' prepared`);
    // RELEASE BONDS
    now = await api.now();
    await api.wait_until(0);

    await api.release_bond(api.master, BOND1);
    await api.release_bond(api.master, BOND2);
    await api.release_bond(api.master, BOND3);
    await api.release_bond(api.master, BOND4);
    console.log(`'${BOND1}' '${BOND2}' '${BOND3}' '${BOND4}' bonds released`);

    await api.wait_until(0);
    await api.buy_bond_units(investor1, BOND1, 100);
    await api.buy_bond_units(investor2, BOND2, 100);

    await api.buy_bond_units(investor1, BOND3, 50);
    await api.buy_bond_units(investor2, BOND3, 50);

    console.log(`${investor1.meta.name} bought 150 bond units`);
    console.log(`${investor2.meta.name} bought 150 bond units`);

    await api.buy_bond_units(investor3, BOND4, 100);
    console.log(`${investor3.meta.name} bought 100 bond units`);


    // GIVE BACK SOME BOND UNITS
    await api.wait_until(0);
    await api.give_back_bond_units(investor3, BOND4, 100);
    console.log(`${investor3.meta.name} give back 100 bond units`);

    // ACTIVATE BONDS
    await api.wait_until(0);
    await api.activate_bond(api.master, auditor.address, BOND1);
    await api.activate_bond(api.master, auditor.address, BOND2);
    await api.activate_bond(api.master, auditor.address, BOND3);

    console.log(`'${BOND1}' '${BOND2}' '${BOND3}' bonds activated`);

    // BUY BOND AFTER ACTIVATION
    await api.wait_until(0);
    await api.buy_bond_units(investor1, BOND3, 50);

    console.log(`${investor1.meta.name} augmented bond package by 50 bond units`);
    // SALE BOND AFTER ACTIVATION
    await api.wait_until(0);
    await api.transfer_ownership(investor1, investor3, now + 100 * BLOCK_INTERVAL, BOND3, 50, 600 * UNIT);
    console.log(`${investor1.meta.name} sold to ${investor3.meta.name} 600 bond units`);

    await api.wait_until(0);
    await api.transfer_ownership(investor2, null, now + 100 * BLOCK_INTERVAL, BOND3, 50, 600 * UNIT);
    await api.transfer_ownership(investor2, null, now + 100 * BLOCK_INTERVAL, BOND3, 50, 600 * UNIT);

    console.log(`${investor2.meta.name} bid 2 x 50 bond units`);
    await api.wait_until(0);
    await api.buy_lot(investor2, investor3, now + 100 * BLOCK_INTERVAL, BOND3, 50, 600 * UNIT);
    console.log(`${investor3.meta.name} bought 50 bond units`);

}

async function scenario2() {

    const everusd = 1000;
    // MINT EVERUSD
    await api.mint(investor1, custodian, everusd * UNIT);
    await api.mint(investor2, custodian, everusd * UNIT);
    await api.mint(investor3, custodian, everusd * UNIT);
    console.log(`each investor has minted ${everusd} everusd`);

    const initialBalance = await api.account_balance(issuer.address);
    console.log(`initial ${issuer.meta.name} balance is ${initialBalance}`);

    // RELEASE BOND
    let now = await api.now();
    const bond = get_bond(api.day_duration, 10);

    await api.prepare_bond(issuer, BOND10, bond);
    console.log(`'${BOND10}' has been prepared `);
    await api.wait_until(0);


    await api.release_bond(api.master, BOND10);
    console.log(`'${BOND10}' has been released `);
    await api.wait_until(0);

    let bond_in_chain = await api.get_bond(BOND10);

    await api.buy_bond_units(investor1, BOND10, 10);
    await api.buy_bond_units(investor2, BOND10, 50);
    await api.buy_bond_units(investor3, BOND10, 100);
    console.log(`'${BOND10}' bond units bought by`);
    console.log(`  ${investor1.meta.name} - 10 units`);
    console.log(`  ${investor2.meta.name} - 50 units`);
    console.log(`  ${investor3.meta.name} - 100 units`);

    await api.wait_until(0);
    await api.activate_bond(api.master, auditor.address, BOND10);
    console.log(`'${BOND10}' has been activated `);
    await api.wait_until(0);

    bond_in_chain = await api.get_bond(BOND10);
    //console.log( JSON.stringify(bond_in_chain, null, 2) );

    const bond_activation_time = bond_in_chain.active_start_date.toNumber();
    console.log(`bond activated at ${bond_activation_time}`);

    await api.wait_until(0);
    const newBalance = await api.account_balance(issuer.address);
    console.log(`new ${issuer.meta.name} balance is ${newBalance}`);
    // first report period
    await api.wait_until(bond_activation_time + 1000 * api.day_duration * 1);

    for (let i = 0; i < 14; i++) {
        // deposit everusd to bond fund for pay off coupon yield
        await api.deposit(issuer, BOND10, 5000000);
        // report period

        await api.report_send(issuer, BOND10, i, 4000 + i * 1000);
        await api.wait_until(0);
        await api.report_approve(auditor, BOND10, i, 4000 + i * 1000);

        // after coupon payment period
        console.log(`wait for ${i} period (${2 * api.day_duration} sec)`);
        await api.wait_until(bond_activation_time + api.day_duration * 1000 * (2 * i + 3));
        // first investor withdraw every period
        await api.withdraw_everusd(investor1, BOND10);
    }

    await api.mint(issuer, custodian, 40 * UNIT);
    console.log(`${issuer.meta.name} get extra 40 everusd for pay off principal value`);
    await api.wait_until(bond_activation_time + api.day_duration * 15);
    await api.bond_redeem(issuer, BOND10);
    console.log(`redeem bond '${BOND10}'`);
    await api.wait_until(0);

    await api.withdraw_everusd(investor1, BOND10);
    await api.withdraw_everusd(investor2, BOND10);
    await api.withdraw_everusd(investor3, BOND10);

    console.log(`withdraw bond '${BOND10}' by all investors`);
    bond_in_chain = await api.get_bond(BOND10);
    console.log(JSON.stringify(bond_in_chain, null, 2));

    await api.wait_until(0);
}

async function status() {

    for (const inv of [investor1, investor2, investor3]) {
        const balance = await api.account_balance(inv.address);
        console.log(`Balance: ${inv.meta.name} => ${balance} everusd`);
    }

    for (const bondid of [BOND1, BOND2, BOND3, BOND4, BOND5]) {
        for (const inv of [investor1, investor2, investor3]) {

            const data = await api.bond_units(bondid, inv.address);
            if (data.length == 0) {
                continue;

            }

            console.log(`Bond: ${bondid} ${inv.meta.name} => ${data}`);
            const lots = await api.bond_unit_lots(bondid, inv.address);
            console.log(`Lot:  ${bondid} ${inv.meta.name} => ${lots}`);
        }
    };
}

async function main() {

    let balance = await api.unit_balance(api.master.address);
    console.log(`master balance is ${balance} UNITS`);


    var args = process.argv.slice(2);

    switch (args[0]) {
        case 'init':
            await api.init();
            const basetokens = 60000000000000;

            await api.create_account(master.address, MASTER_ROLE, basetokens);
            await api.create_account(custodian.address, CUSTODIAN_ROLE, basetokens);
            await api.create_account(auditor.address, AUDITOR_ROLE, basetokens);
            await api.create_account(manager.address, MANAGER_ROLE, basetokens);
            await api.create_account(issuer.address, ISSUER_ROLE, basetokens);
            await api.create_account(investor1.address, INVESTOR_ROLE, basetokens);
            await api.create_account(investor2.address, INVESTOR_ROLE, basetokens);
            await api.create_account(investor3.address, INVESTOR_ROLE, basetokens);
            await api.create_account(superissuer.address, INVESTOR_ROLE + ISSUER_ROLE, basetokens);
            const now = await api.now();
            console.log(`accounts created at ${now}`);

            break;
        case 'status':
            await status();
            break;
        case 'scenario1':
            await scenario1.apply(api, args.slice(1));
            break;
        case 'scenario2':
            await scenario2.apply(api, args.slice(1));
            break;
        default:
            let {
                default: run
            } = await import(args[0]);

            await run();
            break;
    }

    console.log("stopping...");
    api.stop_callback()

}
main().catch(console.error).finally(() => process.exit());