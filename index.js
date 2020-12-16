import connect from './api.js';
import {
    Keyring
} from '@polkadot/api';
const keyring = new Keyring({
    type: 'sr25519'
});

let api = await connect();

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
const BOND10 = "ECBDSC2";

// account roles
const MASTER_ROLE = 1;
const CUSTODIAN_ROLE = 2;
const ISSUER_ROLE = 4;
const INVESTOR_ROLE = 8;
const AUDITOR_ROLE = 16;
const MANAGER_ROLE = 32;

const master = keyring.addFromUri('gallery suffer express depend kite math rich exclude vanish minor risk auction', {
    name: 'MASTER (master)'
});
const custodian = keyring.addFromUri('feature wagon lunar ready topic turkey video firm minute quote critic card', {
    name: 'custodian'
});
const auditor = keyring.addFromUri('border system idle nut era skate course attract good scrub cricket load', {
    name: 'auditor'
});
const manager = keyring.addFromUri('hole planet enjoy kingdom jealous north tell economy cream kiwi person arrive', {
    name: 'manager'
});
const issuer = keyring.addFromUri('where annual glory source ten universe attitude reflect quantum usage snap detect', {
    name: 'issuer'
});
const investor1 = keyring.addFromUri('someone gold unit daughter stairs antenna crazy scorpion total rhythm dish arm', {
    name: 'investor1'
});
const investor2 = keyring.addFromUri('near country below huge eagle salmon solar twelve aim admit glove hospital', {
    name: 'investor2'
});
const investor3 = keyring.addFromUri('crack unhappy mistake absurd funny desk draft awful sport winner clerk force', {
    name: 'investor3'
});
const superissuer = keyring.addFromUri('//SuperIssuer', {
    name: 'issuer+investor'
});

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
    const everusd = 1000;

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
    console.log(`${investor2.meta.name} bid 600 bond units`);
}


async function scenario2() {
    let now = await api.now();
    const everusd = 1000;
    // MINT EVERUSD
    await api.mint(investor1, custodian, everusd * UNIT);
    await api.mint(investor2, custodian, everusd * UNIT);
    await api.mint(investor3, custodian, everusd * UNIT);
    console.log(`each investor has minted ${everusd} everusd`);

    const initialBalance = await api.account_balance(issuer.address);
    console.log(`initial ${issuer.meta.name} balance is ${initialBalance}`);

    // RELEAS BOND
    const bond = get_bond(api.day_duration, 10);

    await api.prepare_bond(issuer, BOND10, bond);
    console.log(`'${BOND10}' has been prepared `);
    await api.wait_until(0);

    await api.release_bond(api.master, BOND10);
    console.log(`'${BOND10}' has been released `);
    await api.wait_until(0);

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

    let bond_in_chain = await api.get_bond(BOND10);

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

    await api.mint(issuer, custodian, 4 * UNIT);
    console.log(`${issuer.meta.name} get extra 4 everusd for pay off principal value`);
    await api.wait_until(bond_activation_time + api.day_duration * 15);
    await api.bond_redeem(issuer, BOND10);
    console.log(`redeem bond '${BOND10}'`);
    await api.wait_until(0);

    await api.withdraw_everusd(investor1, BOND10);
    await api.withdraw_everusd(investor2, BOND10);
    await api.withdraw_everusd(investor3, BOND10);

    console.log(`withdraw bond '${BOND10}' by all investors`);
    await api.wait_until(0);
}

async function main() {
    console.log("create accounts");

    const basetokens = 6000000000;
    const now = await api.now();

    await api.create_account(master.address, MASTER_ROLE, basetokens);
    await api.create_account(custodian.address, CUSTODIAN_ROLE, basetokens);
    await api.create_account(auditor.address, AUDITOR_ROLE, basetokens);
    await api.create_account(manager.address, MANAGER_ROLE, basetokens);
    await api.create_account(issuer.address, ISSUER_ROLE, basetokens);
    await api.create_account(investor1.address, INVESTOR_ROLE, basetokens);
    await api.create_account(investor2.address, INVESTOR_ROLE, basetokens);
    await api.create_account(investor3.address, INVESTOR_ROLE, basetokens);
    await api.create_account(superissuer.address, INVESTOR_ROLE + ISSUER_ROLE, basetokens);

    console.log("accounts created");

    var args = process.argv.slice(2);

    switch (args[0]) {
        case 'scenario1':
            await scenario1.apply(api, args.slice(1));
            break;
        case 'scenario2':
            await scenario2.apply(api, args.slice(1));
            break;
        default:
            console.log('account created');
            break
    }
    console.log("stopping...");
    api.stop_callback()
    console.log("end of script");
}
main().catch(console.error).finally(() => process.exit());