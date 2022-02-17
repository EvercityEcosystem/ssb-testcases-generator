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
    superissuer,
    accounts_master,
    cc_project_owner,
    cc_auditor,
    cc_standard,
    cc_registry,
    cc_investor
} from './init.js'

const BLOCK_INTERVAL = 6000;
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

// pallet accounts roles

const CC_PROJECT_OWNER_ROLE = 256;
const CC_AUDITOR_ROLE = 512;
const CC_STANDARD_ROLE = 1024;
const CC_INVESTOR_ROLE = 2048;
const CC_REGISTRY_ROLE = 4096;

// Filesign const
const PDD_TAG = "PDD TAG";
const PDD_FILEHASH = "0101010101010101";
const PDD_FILE_ID = "01234567890123456";

const REPORT_TAG = "REPORT TAG";
const REPORT_FILEHASH = "1231231231231236";
const REPORT_FILE_ID = "111111111111111111";
const CREDITS_COUNT = 1100;
const CC_NAME = "TEST Carbon Credit";
const CC_TAG= "TCC";
const DECIMALS = 0;
const CC_ASSET_ID = 1;

const GOLD_STANDARD = "GOLD_STANDARD";

const accounts = [
    master,
    custodian,
    auditor,
    manager,
    issuer,
    investor1,
    investor2,
    investor3,
    superissuer,
    accounts_master,
    cc_project_owner,
    cc_auditor,
    cc_standard,
    cc_registry,
    cc_investor
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

function get_stable_bond(day, price) {
    return {
        "docs_pack_root_hash_main": [0],
        "docs_pack_root_hash_legal": [0],
        "docs_pack_root_hash_finance": [0],
        "docs_pack_root_hash_tech": [0],

        "impact_data_type": "POWER_GENERATED",
        "impact_data_baseline": [null, null, null, null, null, null, null, null, null, null, null, null],
        "impact_data_max_deviation_cap": null,
        "impact_data_max_deviation_floor": null,
        "impact_data_send_period": 0,
        "interest_rate_penalty_for_missed_report": null,
        "interest_rate_base_value": 3000,
        "interest_rate_margin_cap": null,
        "interest_rate_margin_floor": null,
        "interest_rate_start_period_value": null,
        "interest_pay_period": null,
        "start_period": null,
        "payment_period": null,
        "bond_duration": 12,
        "bond_finishing_period": 100 * day,
        "mincap_deadline": 0,
        "bond_units_mincap_amount": 100,
        "bond_units_maxcap_amount": 600,
        "bond_units_base_price": price * UNIT
    }
}

function get_bond_carbon_credits_included(day, price) {
    return {
        "docs_pack_root_hash_main": [0],
        "docs_pack_root_hash_legal": [0],
        "docs_pack_root_hash_finance": [0],
        "docs_pack_root_hash_tech": [0],

        "impact_data_type": "POWER_GENERATED",
        "impact_data_baseline": [null, null, null, null, null, null, null, null, null, null, null, null],
        "impact_data_max_deviation_cap": null,
        "impact_data_max_deviation_floor": null,
        "impact_data_send_period": 0,
        "interest_rate_penalty_for_missed_report": null,
        "interest_rate_base_value": 3000,
        "interest_rate_margin_cap": null,
        "interest_rate_margin_floor": null,
        "interest_rate_start_period_value": null,
        "interest_pay_period": null,
        "start_period": null,
        "payment_period": null,
        "bond_duration": 12,
        "bond_finishing_period": 100 * day,
        "mincap_deadline": 0,
        "bond_units_mincap_amount": 100,
        "bond_units_maxcap_amount": 600,
        "bond_units_base_price": price * UNIT,
        "carbon_metadata": {
            "count": 100_000
        }
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
    
    let bond_in_chain = await api.get_bond(BOND1);
    console.log(JSON.stringify(bond_in_chain, null, 2));
}

async function scenario2() {
    const bond = get_bond(api.day_duration, 10);
    await bond_flow(bond);
}

async function scenario3() {
    const bond = get_stable_bond(api.day_duration, 10);
    await bond_flow(bond);
}

async function scenario4() {
    await api.mint(investor1, custodian, everusd * UNIT);
    await api.mint(investor2, custodian, everusd * UNIT);
    await api.mint(investor3, custodian, everusd * UNIT);
    const bond1 = get_bond_carbon_credits_included(api.day_duration, 10);
    console.log(bond1);
    await bond_flow(bond1);

    await api.wait_until(0);
    let res = await api.release_bond_carbon_credits(investor2, 1, BOND10, 1_000_000);
    // await api.wait_until(0);
    // await api.release_bond_carbon_credits(issuer, 1, BOND2, 1_000_000);
    // await api.wait_until(0);
    // await api.release_bond_carbon_credits(issuer, 1, BOND3, 1_000_000);
    // await api.wait_until(0);
    // await api.release_bond_carbon_credits(issuer, 1, BOND4, 1_000_000);
    // console.log(res)
    await api.wait_until(0);

    let investor1_asset_info = await api.get_user_asset_info(1, investor1.address);
    let investor2_asset_info = await api.get_user_asset_info(1, investor2.address);
    let investor3_asset_info = await api.get_user_asset_info(1, investor3.address);

    console.log(JSON.stringify(investor1_asset_info, null, 2));
    console.log(JSON.stringify(investor2_asset_info, null, 2));
    console.log(JSON.stringify(investor3_asset_info, null, 2));
}

async function bond_flow(bond) {
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
        await api.deposit(issuer, BOND10, 1000000000);
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

/// MAIN FLOW OF GOLD STANDARD
async function carbon_credits_scenario1() {
    // Create file
    await api.filesign_create_file(cc_project_owner, PDD_TAG, PDD_FILEHASH, PDD_FILE_ID);
    console.log(`${cc_project_owner.address} created file with id ${PDD_FILE_ID}`);
    await api.wait_until(0);

    // Create project:
    // Id will be = 1
    await api.cc_create_project(cc_project_owner, GOLD_STANDARD, PDD_FILE_ID);
    console.log(`${cc_project_owner.address} created ${GOLD_STANDARD} project 1`);
    await api.wait_until(0);

    // Add signers
    await api.cc_assign_project_signer(cc_project_owner, cc_project_owner.address, CC_PROJECT_OWNER_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_project_owner.address} as CC_PROJECT_OWNER_ROLE to project 1 signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(cc_project_owner, cc_auditor.address, CC_AUDITOR_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_auditor.address} as CC_AUDITOR_ROLE to project 1 signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(cc_project_owner, cc_standard.address, CC_STANDARD_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_standard.address} as CC_STANDARD_ROLE to project 1 signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(cc_project_owner, cc_registry.address, CC_REGISTRY_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_registry.address} as CC_REGISTRY_ROLE to project 1 signers`);
    await api.wait_until(0);

    // sign by gold standard order
    // Project Owner submits PDD (changing status to Registration) => 
    // => Auditor Approves PDD => Standard Certifies PDD => Registry Registers PDD (changing status to Issuance)
    await api.cc_sign_project(cc_project_owner, 1);
    console.log(`owner ${cc_project_owner.address} signed the project with id 1`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_auditor, 1);
    console.log(`auditor ${cc_auditor.address} signed the project with id 1`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_standard, 1);
    console.log(`standard ${cc_standard.address} signed the project with id 1`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_registry, 1);
    console.log(`registry ${cc_registry.address} signed the project with id 1`);
    await api.wait_until(0);

    // Add report
    await api.cc_create_report_with_file(cc_project_owner, 1, REPORT_FILE_ID, REPORT_FILEHASH, REPORT_TAG, CREDITS_COUNT, CC_NAME, CC_TAG, DECIMALS);
    console.log(`${cc_project_owner.address} created first annual report in project 1 holding ${CREDITS_COUNT} carbon credits`);
    await api.wait_until(0);

    // Add report signers
    await api.cc_assign_report_signer(cc_project_owner, cc_project_owner.address, CC_PROJECT_OWNER_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_project_owner.address} as CC_PROJECT_OWNER_ROLE to project 1 report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(cc_project_owner, cc_auditor.address, CC_AUDITOR_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_auditor.address} as CC_AUDITOR_ROLE to project 1 report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(cc_project_owner, cc_standard.address, CC_STANDARD_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_standard.address} as CC_STANDARD_ROLE to project 1 report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(cc_project_owner, cc_registry.address, CC_REGISTRY_ROLE, 1);
    console.log(`${cc_project_owner.address} added ${cc_registry.address} as CC_REGISTRY_ROLE to project 1 report signers`);
    await api.wait_until(0);

    // Sign report
    // Project Owner sends report for verification =>  Auditor provides and submits verification report => 
    // Standard Approves carbon credit issuance => Registry issues carbon credits
    await api.cc_sign_last_report(cc_project_owner, 1);
    console.log(`owner ${cc_project_owner.address} signed the project 1 last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_auditor, 1);
    console.log(`auditor ${cc_auditor.address} signed the project 1 last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_standard, 1);
    console.log(`standard ${cc_standard.address} signed the project 1 last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_registry, 1);
    console.log(`registry ${cc_registry.address} signed the project 1 last annual report`);
    await api.wait_until(0);

    // Release Carbon credits and burn some
    await api.cc_release_carbon_credits(cc_project_owner, 1, CC_ASSET_ID, cc_project_owner.address, 1);
    console.log(`${cc_project_owner.address} released project 1 last annual report carbon credits`);
    await api.wait_until(0);
    let owner_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_project_owner.address);
    console.log(`${cc_project_owner.address} now has ${owner_asset_info.balance} carbon credits`);
    await api.burn_carbon_credits(cc_project_owner, CC_ASSET_ID, 50);
    console.log(`${cc_project_owner.address} burned 50 asset ${CC_ASSET_ID} carbon credits`);
    await api.wait_until(0);

    // Transfer Carbon credits
    await api.transfer_carbon_credits(cc_project_owner, CC_ASSET_ID, cc_investor.address, 50);
    console.log(`${cc_project_owner.address} transfered 50 asset ${CC_ASSET_ID} carbon credits to ${cc_investor.address}`);
    await api.wait_until(0);
    let investor_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_investor.address);
    console.log(`${cc_investor.address} now has ${investor_asset_info.balance} carbon credits`);

    // Burn Carbon credits
    await api.burn_carbon_credits(cc_investor, CC_ASSET_ID, 30);
    console.log(`${cc_investor.address} burned 30 asset ${CC_ASSET_ID} carbon credits`);
    await api.wait_until(0);

    owner_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_project_owner.address);
    investor_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_investor.address);

    console.log(`${cc_project_owner.address} now has ${owner_asset_info.balance} carbon credits`);
    console.log(`${cc_investor.address} now has ${investor_asset_info.balance} carbon credits`);

    console.log(`Scenario1 has been completed successfully!`);
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
        case 'init_cc':
            await api.init();
            const basetokens_cc = 60000000000000;

            // create pallet-evercity-accounts accounts:
            await api.set_pa_master(accounts_master.address, basetokens_cc);
            await api.create_pa_account(cc_project_owner.address, CC_PROJECT_OWNER_ROLE, basetokens_cc);
            await api.create_pa_account(cc_auditor.address, CC_AUDITOR_ROLE, basetokens_cc);
            await api.create_pa_account(cc_standard.address, CC_STANDARD_ROLE, basetokens_cc);
            await api.create_pa_account(cc_registry.address, CC_REGISTRY_ROLE, basetokens_cc);
            await api.create_pa_account(cc_investor.address, CC_INVESTOR_ROLE, basetokens_cc);

            const now_cc = await api.now();
            console.log(`accounts for carbon credits created at ${now_cc}`);

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
        case 'scenario3':
            await scenario3.apply(api, args.slice(1));
            break;
        case 'scenario4':
            await scenario4.apply(api, args.slice(1));
            break;
        case 'carbon_credits_scenario1':
            await carbon_credits_scenario1.apply(api, args.slice(1));
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