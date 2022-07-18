import {
    api,
    bond_arranger,
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
const BOND1 = "ECBD101000000000";
const BOND2 = "ECBD102000000000";
const BOND3 = "ECBD103000000000";
const BOND4 = "ECBD104000000000";
const BOND5 = "ECBD105000000000";
// scenario2 bond
// const BOND10 = "ECBDSC8";
const BOND10 = "1111111111111111";
const BOND22 = "2222222222222222";
const CC_BOND_1 = "CCBOND1000000000";
const CC_BOND_2 = "CCBOND2000000000";


// account roles
const MASTER_ROLE = 1;
const CUSTODIAN_ROLE = 2;
const ISSUER_ROLE = 4;
const INVESTOR_ROLE = 8;
const AUDITOR_ROLE = 16;
const MANAGER_ROLE = 32;
const BOND_ARRANGER = 128;

// pallet accounts roles

const CC_PROJECT_OWNER_ROLE = 256;
const CC_AUDITOR_ROLE = 512;
const CC_STANDARD_ROLE = 1024;
const CC_INVESTOR_ROLE = 2048;
const CC_REGISTRY_ROLE = 4096;

// Filesign const
const PDD_TAG = "PDD TAG";
const PDD_FILEHASH = "01010101010101010101010101010101";

const REPORT_TAG = "REPORT TAG";
const REPORT_FILEHASH = "12312312312312361231231231231236";
const CREDITS_COUNT = 1100;
const CC_NAME = "TEST Carbon Credit";
const CC_TAG= "TCC";
const DECIMALS = 0;
const CC_ASSET_ID = 1;

const GOLD_STANDARD = "GOLD_STANDARD";

const accounts = [bond_arranger,
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
        "docs_pack_root_hash_main": '00000000000000000000000000000000',
        "docs_pack_root_hash_legal": '00000000000000000000000000000000',
        "docs_pack_root_hash_finance": '00000000000000000000000000000000',
        "docs_pack_root_hash_tech": '00000000000000000000000000000000',

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
        "docs_pack_root_hash_main": '00000000000000000000000000000000',
        "docs_pack_root_hash_legal": '00000000000000000000000000000000',
        "docs_pack_root_hash_finance": '00000000000000000000000000000000',
        "docs_pack_root_hash_tech": '00000000000000000000000000000000',

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

function get_bond_carbon_credits_included(day, price) {
    return {
        "docs_pack_root_hash_main": '00000000000000000000000000000000',
        "docs_pack_root_hash_legal": '00000000000000000000000000000000',
        "docs_pack_root_hash_finance": '00000000000000000000000000000000',
        "docs_pack_root_hash_tech": '00000000000000000000000000000000',

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
        "start_period": 2 * day,
        "payment_period": 2 * day,
        "bond_duration": 12,
        "bond_finishing_period": 100 * day,
        "mincap_deadline": 0,
        "bond_units_mincap_amount": 100,
        "bond_units_maxcap_amount": 600,
        "bond_units_base_price": price * UNIT,
        "carbon_metadata": {
            "count": 1000,
            "carbon_distribution": {
                "investors": 50_000,
                "issuer": 50_000
            },
            "account_investments": null
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

    await api.release_bond(bond_arranger, BOND1);
    await api.release_bond(bond_arranger, BOND2);
    await api.release_bond(bond_arranger, BOND3);
    await api.release_bond(bond_arranger, BOND4);
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
    await api.activate_bond(bond_arranger, auditor.address, BOND1);
    await api.activate_bond(bond_arranger, auditor.address, BOND2);
    await api.activate_bond(bond_arranger, auditor.address, BOND3);

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
    console.log(bond_in_chain.toHuman());
}

async function scenario2() {
    const bond = get_bond(api.day_duration, 10);
    await bond_flow(bond);
}

async function scenario3() {
    const bond = get_stable_bond(api.day_duration, 10);
    await stable_bond_flow(bond, BOND22);
}

async function scenario4() {
    const bond = get_bond_carbon_credits_included(api.day_duration, 10);
    console.log(bond);
    await stable_bond_flow(bond, CC_BOND_2);

    console.log("Bond finished");
    await api.wait_until(0);

    // Create file
    let pdd_file_id = get_random_16b_id();
    await api.filesign_create_file(issuer, PDD_TAG, PDD_FILEHASH, pdd_file_id);
    // console.log(pdd_file_id);
    console.log(`${issuer.address} created file with id ${pdd_file_id}`);
    await api.wait_until(0);

    // Create project:
    let last_id = await api.get_last_cc_project_id();
    const PROJECT_ID = parseInt(last_id) + 1;
    await api.cc_create_bond_project(issuer, "GOLD_STANDARD_BOND", pdd_file_id, CC_BOND_2);
    console.log(`${issuer.address} created GOLD_STANDARD_BOND project ${PROJECT_ID}`);
    await api.wait_until(0);
    let proj = await api.get_cc_project(PROJECT_ID);
    console.log(proj.unwrap().toHuman());

    // Add signers
    await api.cc_assign_project_signer(issuer, issuer.address, CC_PROJECT_OWNER_ROLE, PROJECT_ID);
    console.log(`${issuer.address} added ${issuer.address} as CC_PROJECT_OWNER_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(issuer, cc_auditor.address, CC_AUDITOR_ROLE, PROJECT_ID);
    console.log(`${issuer.address} added ${cc_auditor.address} as CC_AUDITOR_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(issuer, cc_registry.address, CC_REGISTRY_ROLE, PROJECT_ID);
    console.log(`${issuer.address} added ${cc_registry.address} as CC_REGISTRY_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);

    // sign by gold standard bond order
    // Project Owner submits PDD (changing status to Registration) => 
    // => Auditor Approves PDD => Registry Registers PDD (changing status to Issuance)
    await api.cc_sign_project(issuer, PROJECT_ID);
    console.log(`owner ${issuer.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_auditor, PROJECT_ID);
    console.log(`auditor ${cc_auditor.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_registry, PROJECT_ID);
    console.log(`registry ${cc_registry.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);

    // Add report
    let report_id = get_random_16b_id();
    await api.cc_create_report_with_file(issuer, PROJECT_ID, report_id, REPORT_FILEHASH, REPORT_TAG, CREDITS_COUNT, CC_NAME, CC_TAG, DECIMALS);
    console.log(`${issuer.address} created first annual report in project ${PROJECT_ID} holding ${CREDITS_COUNT} carbon credits`);
    await api.wait_until(0);
  
    // Add report signers
    await api.cc_assign_report_signer(issuer, issuer.address, CC_PROJECT_OWNER_ROLE, PROJECT_ID);
    console.log(`${issuer.address} added ${issuer.address} as CC_PROJECT_OWNER_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(issuer, cc_auditor.address, CC_AUDITOR_ROLE, PROJECT_ID);
    console.log(`${issuer.address} added ${cc_auditor.address} as CC_AUDITOR_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(issuer, cc_registry.address, CC_REGISTRY_ROLE, PROJECT_ID);
    console.log(`${issuer.address} added ${cc_registry.address} as CC_REGISTRY_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);

    // Sign report
    // Project Owner sends report for verification =>  Auditor provides and submits verification report => 
    // => Registry issues carbon credits
    await api.cc_sign_last_report(issuer, PROJECT_ID);
    console.log(`owner ${issuer.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_auditor, PROJECT_ID);
    console.log(`auditor ${cc_auditor.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_registry, PROJECT_ID);
    console.log(`registry ${cc_registry.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);

    // Release Bond Carbon credits
    const ASSET_ID = 12;
    await api.release_bond_carbon_credits(issuer, PROJECT_ID, ASSET_ID);
    await api.wait_until(0);

    let issuer_asset_info = await api.get_user_asset_info(ASSET_ID, issuer.address);
    let investor1_asset_info = await api.get_user_asset_info(ASSET_ID, investor1.address);
    let investor2_asset_info = await api.get_user_asset_info(ASSET_ID, investor2.address);
    let investor3_asset_info = await api.get_user_asset_info(ASSET_ID, investor3.address);

    console.log("issuer has "+issuer_asset_info.balance.toHuman()+" carbon assets.");
    console.log("investor1 has "+investor1_asset_info.balance.toHuman()+" carbon assets.");
    console.log("investor2 has "+investor2_asset_info.balance.toHuman()+" carbon assets.");
    console.log("investor3 has "+investor3_asset_info.balance.toHuman()+" carbon assets.");
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


    await api.release_bond(bond_arranger, BOND10);
    console.log(`'${BOND10}' has been released `);
    await api.wait_until(0);

    let bond_in_chain = await api.get_bond(BOND10);
    console.log(bond_in_chain.toHuman());

    await api.buy_bond_units(investor1, BOND10, 10);
    await api.buy_bond_units(investor2, BOND10, 50);
    await api.buy_bond_units(investor3, BOND10, 100);
    console.log(`'${BOND10}' bond units bought by`);
    console.log(`  ${investor1.meta.name} - 10 units`);
    console.log(`  ${investor2.meta.name} - 50 units`);
    console.log(`  ${investor3.meta.name} - 100 units`);

    await api.wait_until(0);
    await api.activate_bond(bond_arranger, auditor.address, BOND10);
    console.log(`'${BOND10}' has been activated `);
    await api.wait_until(0);

    bond_in_chain = await api.get_bond(BOND10);
    console.log(bond_in_chain.toHuman() );

    const bond_activation_time = bond_in_chain.activeStartDate.toNumber();
    console.log(`bond activated at ${bond_activation_time}`);

    await api.wait_until(0);
    const newBalance = await api.account_balance(issuer.address);
    console.log(`new ${issuer.meta.name} balance is ${newBalance}`);
    // first report period
    await api.wait_until(bond_activation_time + 1000 * api.day_duration * 1);

    for (let i = 0; i < 12; i++) {
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
    await api.wait_until(bond_activation_time + api.day_duration * 1000 * (2 * 12 + 3));
    await api.bond_redeem(issuer, BOND10);
    console.log(`redeem bond '${BOND10}'`);
    await api.wait_until(0);

    await api.withdraw_everusd(investor1, BOND10);
    await api.withdraw_everusd(investor2, BOND10);
    await api.withdraw_everusd(investor3, BOND10);
    await api.wait_until(0);

    console.log(`withdraw bond '${BOND10}' by all investors`);
    bond_in_chain = await api.get_bond(BOND10);
    console.log(bond_in_chain.toHuman());

    await api.wait_until(0);
}


async function stable_bond_flow(bond, bond_id) {
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

    await api.prepare_bond(issuer, bond_id, bond);
    console.log(`'${bond_id}' has been prepared `);
    await api.wait_until(0);


    await api.release_bond(bond_arranger, bond_id);
    console.log(`'${bond_id}' has been released `);
    await api.wait_until(0);

    let bond_in_chain = await api.get_bond(bond_id);
    console.log(bond_in_chain.toHuman());

    let u1 = await api.buy_bond_units(investor1, bond_id, 10);
    let u2 = await api.buy_bond_units(investor2, bond_id, 50);
    let u3 = await api.buy_bond_units(investor3, bond_id, 100);
    console.log(`'${bond_id}' bond units bought by`);
    console.log(`  ${investor1.meta.name} - 10 units`);
    console.log(`  ${investor2.meta.name} - 50 units`);
    console.log(`  ${investor3.meta.name} - 100 units`);
    await api.wait_until(0);

    await api.wait_until(0);
    await api.activate_bond(bond_arranger, auditor.address, bond_id);
    console.log(`'${bond_id}' has been activated `);
    await api.wait_until(0);

    bond_in_chain = await api.get_bond(bond_id);

    const bond_activation_time = bond_in_chain.activeStartDate.toNumber();
    console.log(`bond activated at ${bond_activation_time}`);

    await api.wait_until(0);
    const newBalance = await api.account_balance(issuer.address);
    console.log(`new ${issuer.meta.name} balance is ${newBalance}`);
    // first report period
    await api.wait_until(bond_activation_time + 1000 * api.day_duration * 1);

    for (let i = 0; i < 12; i++) {
        // deposit everusd to bond fund for pay off coupon yield
        await api.deposit(issuer, bond_id, 1000000000);
        
        // after coupon payment period
        console.log(`wait for ${i} period (${2 * api.day_duration} sec)`);
        await api.wait_until(bond_activation_time + api.day_duration * 1000 * (2 * i + 3));
        // first investor withdraw every period
        await api.withdraw_everusd(investor1, bond_id);
    }

    await api.mint(issuer, custodian, 40 * UNIT);
    console.log(`${issuer.meta.name} get extra 40 everusd for pay off principal value`);
    await api.wait_until(bond_activation_time + api.day_duration * 1000 * (2 * 12 + 3));
    await api.bond_redeem(issuer, bond_id);
    console.log(`redeem bond '${bond_id}'`);
    await api.wait_until(0);

    await api.withdraw_everusd(investor1, bond_id);
    await api.withdraw_everusd(investor2, bond_id);
    await api.withdraw_everusd(investor3, bond_id);
    await api.wait_until(0);

    console.log(`withdraw bond '${bond_id}' by all investors`);
    bond_in_chain = await api.get_bond(bond_id);
    console.log(bond_in_chain.toHuman());

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
    let pdd_file_id = get_random_16b_id();
    await api.filesign_create_file(cc_project_owner, PDD_TAG, PDD_FILEHASH, pdd_file_id);
    console.log(`${cc_project_owner.address} created file with id ${pdd_file_id}`);
    await api.wait_until(0);

    // Create project:
    let last_id = await api.get_last_cc_project_id();
    const PROJECT_ID = parseInt(last_id) + 1;
    await api.cc_create_project(cc_project_owner, GOLD_STANDARD, pdd_file_id);
    console.log(`${cc_project_owner.address} created ${GOLD_STANDARD} project ${PROJECT_ID}`);
    await api.wait_until(0);

    // Add signers
    await api.cc_assign_project_signer(cc_project_owner, cc_project_owner.address, CC_PROJECT_OWNER_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_project_owner.address} as CC_PROJECT_OWNER_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(cc_project_owner, cc_auditor.address, CC_AUDITOR_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_auditor.address} as CC_AUDITOR_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(cc_project_owner, cc_standard.address, CC_STANDARD_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_standard.address} as CC_STANDARD_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);
    await api.cc_assign_project_signer(cc_project_owner, cc_registry.address, CC_REGISTRY_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_registry.address} as CC_REGISTRY_ROLE to project ${PROJECT_ID} signers`);
    await api.wait_until(0);

    // sign by gold standard order
    // Project Owner submits PDD (changing status to Registration) => 
    // => Auditor Approves PDD => Standard Certifies PDD => Registry Registers PDD (changing status to Issuance)
    await api.cc_sign_project(cc_project_owner, PROJECT_ID);
    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_auditor, PROJECT_ID);
    console.log(`${cc_auditor.meta.name} ${cc_auditor.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_standard, PROJECT_ID);
    console.log(`${cc_standard.meta.name} ${cc_standard.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);
    await api.cc_sign_project(cc_registry, PROJECT_ID);
    console.log(`${cc_registry.meta.name} ${cc_registry.address} signed the project with id ${PROJECT_ID}`);
    await api.wait_until(0);

    // Add report
    let report_id = get_random_16b_id();
    await api.cc_create_report_with_file(cc_project_owner, PROJECT_ID, report_id, REPORT_FILEHASH, REPORT_TAG, CREDITS_COUNT, CC_NAME, CC_TAG, DECIMALS);
    console.log(`${cc_project_owner.address} created first annual report in project ${PROJECT_ID} holding ${CREDITS_COUNT} carbon credits`);
    await api.wait_until(0);

    // Add report signers
    await api.cc_assign_report_signer(cc_project_owner, cc_project_owner.address, CC_PROJECT_OWNER_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_project_owner.address} as CC_PROJECT_OWNER_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(cc_project_owner, cc_auditor.address, CC_AUDITOR_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_auditor.address} as CC_AUDITOR_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(cc_project_owner, cc_standard.address, CC_STANDARD_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_standard.address} as CC_STANDARD_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);
    await api.cc_assign_report_signer(cc_project_owner, cc_registry.address, CC_REGISTRY_ROLE, PROJECT_ID);
    console.log(`${cc_project_owner.address} added ${cc_registry.address} as CC_REGISTRY_ROLE to project ${PROJECT_ID} report signers`);
    await api.wait_until(0);

    // Sign report
    // Project Owner sends report for verification =>  Auditor provides and submits verification report => 
    // Standard Approves carbon credit issuance => Registry issues carbon credits
    await api.cc_sign_last_report(cc_project_owner, PROJECT_ID);
    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_auditor, PROJECT_ID);
    console.log(`${cc_auditor.meta.name} ${cc_auditor.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_standard, PROJECT_ID);
    console.log(`${cc_standard.meta.name} ${cc_standard.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);
    await api.cc_sign_last_report(cc_registry, PROJECT_ID);
    console.log(`${cc_registry.meta.name} ${cc_registry.address} signed the project ${PROJECT_ID} last annual report`);
    await api.wait_until(0);

    // Release Carbon credits and burn some
    await api.cc_release_carbon_credits(cc_project_owner, PROJECT_ID, CC_ASSET_ID, cc_project_owner.address, 1);
    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} released project ${PROJECT_ID} last annual report carbon credits`);
    await api.wait_until(0);
    let owner_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_project_owner.address);
    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} now has ${owner_asset_info.balance} carbon credits`);
    await api.burn_carbon_credits(cc_project_owner, CC_ASSET_ID, 50);
    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} burned 50 asset ${CC_ASSET_ID} carbon credits`);
    await api.wait_until(0);

    // // Transfer Carbon credits
    // Create Carbon credits lot
    let deadline = new Date().getTime() + 2_592_000;
    await api.create_carbon_credits_lot(cc_project_owner, CC_ASSET_ID, deadline, 50, 10);
    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} created lot with 50 carbon credits`);
    await api.wait_until(0);
    // Buy Carbon credits lot
    const everusd = 2000;
    await api.mint(cc_investor, custodian, everusd * UNIT);
    console.log(`cc_investor has minted ${everusd} everusd`);
    await api.wait_until(0);
    await api.buy_carbon_credits_lot(cc_investor, cc_project_owner.address, CC_ASSET_ID, deadline, 50, 10);
    console.log(`${cc_investor.meta.name} ${cc_investor.address} bought lot with 50 carbon credits`);
    await api.wait_until(0);
    let investor_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_investor.address);
    console.log(`${cc_investor.meta.name} ${cc_investor.address} now has ${investor_asset_info.balance} carbon credits`);

    // Burn Carbon credits
    await api.burn_carbon_credits(cc_investor, CC_ASSET_ID, 30);
    console.log(`${cc_investor.meta.name} ${cc_investor.address} burned 30 asset ${CC_ASSET_ID} carbon credits`);
    await api.wait_until(0);

    owner_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_project_owner.address);
    investor_asset_info = await api.get_user_asset_info(CC_ASSET_ID, cc_investor.address);

    console.log(`${cc_project_owner.meta.name} ${cc_project_owner.address} now has ${owner_asset_info.balance} carbon credits`);
    console.log(`${cc_investor.meta.name} ${cc_investor.address} now has ${investor_asset_info.balance} carbon credits`);

    console.log(`Carbon credits scenario1 has been completed successfully!`);
}

function get_random_16b_id() {
    return (Math.random().toString(36)+'00000000000000000').slice(2, 16+2);
}

async function main() {

    let balance = await api.unit_balance(api.accounts_master.address);
    console.log(`accounts_master balance is ${balance} UNITS`);


    var args = process.argv.slice(2);

    switch (args[0]) {
        case 'init':
            await api.init();
            const basetokens = 60000000000000;

            //await api.set_pa_master(accounts_master.address, basetokens);
            await api.create_account(bond_arranger.address, BOND_ARRANGER, basetokens);
            await api.create_account(custodian.address, CUSTODIAN_ROLE, basetokens);
            await api.create_account(auditor.address, AUDITOR_ROLE, basetokens);
            await api.create_account(manager.address, MANAGER_ROLE, basetokens);
            await api.create_account(issuer.address, ISSUER_ROLE | CC_PROJECT_OWNER_ROLE, basetokens);
            await api.create_account(investor1.address, INVESTOR_ROLE, basetokens);
            await api.create_account(investor2.address, INVESTOR_ROLE, basetokens);
            await api.create_account(investor3.address, INVESTOR_ROLE, basetokens);
            await api.create_account(superissuer.address, INVESTOR_ROLE + ISSUER_ROLE, basetokens);

            const now = await api.now();
            console.log(`accounts created at ${now}`);

            // create pallet-evercity-accounts accounts:
            await api.create_account(cc_project_owner.address, CC_PROJECT_OWNER_ROLE, basetokens);
            await api.create_account(cc_auditor.address, CC_AUDITOR_ROLE, basetokens);
            await api.create_account(cc_standard.address, CC_STANDARD_ROLE, basetokens);
            await api.create_account(cc_registry.address, CC_REGISTRY_ROLE, basetokens);
            await api.create_account(cc_investor.address, CC_INVESTOR_ROLE | INVESTOR_ROLE, basetokens);

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
        case 'scenario_cc1':
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