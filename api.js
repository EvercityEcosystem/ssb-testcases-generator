// Import
import {
    ApiPromise,
    WsProvider,
    Keyring
} from '@polkadot/api';
import dotenv from 'dotenv';
import {
    readFileSync
} from 'fs';
dotenv.config();


const DEFAULT_MINCAP_DEADLINE = 3600 * 1000; // msec

const keyring = new Keyring({
    type: 'sr25519'
});



class NodeConnection {
    callback = [];
    nonce = 1;
    constructor(api) {
        this.api = api;
    }
    errorLogFunc = ({ status, events, dispatchError }) => {
      // status would still be set, but in the case of error we can shortcut
      // to just check it (so an error would indicate InBlock or Finalized)
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = this.api.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;
    
          console.log(`!!!     dispatchError ${section}.${name}: ${docs.join(' ')}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log("!!!     dispatchError "+dispatchError.toString());
        }
      }
    };

    async now() {
        const bn = await this.api.query.timestamp.now();
        return bn.toNumber();
    }

    createType() {
        return this.api.createType(arguments[0], arguments[1]);
    }

    wait_until(moment) {
        return new Promise((resolve, reject) => {
            const m = (moment == 0) ? "unshift" : "push";

            this.callback[m]({
                moment,
                resolve,
                reject
            });
        });
    }

    stop_callback() {
        this.unsub();
        for (let item of this.callback) {
            item.reject("stopping");
        }
        this.callback = [];
        this.api = null;
    }
    async transfer(addr, amount) {
        await this.api.tx.balances.transfer(addr, amount).signAndSend(this.accounts_master,
           this.errorLogFunc);
    }

    async init() {
        await this.api.tx.evercityAccounts.setMaster().signAndSend(this.accounts_master,
            this.errorLogFunc);
    }

    async unit_balance(addr) {
        const account = await this.api.query.system.account(addr);
        return account.data.free;
    }

    async bond_units(bondid, addr) {
        return await this.api.query.evercity.bondUnitPackageRegistry(bondid, addr)
    }

    async bond_unit_lots(bondid, addr) {
        return await this.api.query.evercity.bondUnitPackageLot(bondid, addr)
    }

    async create_account(addr, role, amount) {
        await this.api.tx.evercityAccounts.accountAddWithRoleAndData(addr, role, 0).signAndSend(this.accounts_master, {
            nonce: -1
        }, this.errorLogFunc);
        await this.api.tx.balances.transfer(addr, amount).signAndSend(this.accounts_master, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async request_everusd(account, amount) {
        await this.api.tx.evercity.tokenMintRequestCreateEverusd(amount).signAndSend(account, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async mint(account, custodian, amount) {
        await this.api.tx.evercity.tokenMintRequestCreateEverusd(amount).signAndSend(account, {
            nonce: -1
        }, this.errorLogFunc);
        await this.api.tx.evercity.tokenMintRequestConfirmEverusd(account.address, amount).signAndSend(custodian, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async account_balance(addr) {
        const balance = await this.api.query.evercity.balanceEverUSD(addr);
        return balance.toNumber();
    }

    async prepare_bond(issuer, bondid, bond) {
        const now = await this.api.query.timestamp.now();
        bond.mincap_deadline = now.toNumber() + DEFAULT_MINCAP_DEADLINE;
        await this.api.tx.evercity.bondAddNew(bondid, bond).signAndSend(issuer, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async get_bond(bondid) {
        let bond = await this.api.query.evercity.bondRegistry(bondid);
        return bond.unwrap();
    }

    async release_bond(bond_arranger, bondid) {
        const bond = await this.get_bond(bondid);

        await this.api.tx.evercity.bondRelease(bondid, bond.nonce.toNumber()).signAndSend(bond_arranger, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async activate_bond(bond_arranger, auditorid, bondid) {
        // get nonce value
        const bond = await this.get_bond(bondid);

        await this.api.tx.evercity.bondSetAuditor(bondid, auditorid).signAndSend(bond_arranger, {
            nonce: -1
        }, this.errorLogFunc);

        await this.api.tx.evercity.bondActivate(bondid, bond.nonce.toNumber() + 1).signAndSend(bond_arranger, {
            nonce: -1
        }, this.errorLogFunc);
        return bond;
    }

    async buy_bond_units(investor, bondid, count) {
        const bond = await this.get_bond(bondid);
        await this.api.tx.evercity.bondUnitPackageBuy(bondid, bond.nonce.toNumber(), count).signAndSend(investor, {
            nonce: -1
        }, this.errorLogFunc);
        return await this.api.query.evercity.bondUnitPackageRegistry(bondid, investor.address);
    }

    async get_bond_units(bondid, investor) {
        return await this.api.query.evercity.bondUnitPackageRegistry(bondid, investor);
    }

    async give_back_bond_units(investor, bondid, count) {
        await this.api.tx.evercity.bondUnitPackageReturn(bondid, count).signAndSend(investor, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async transfer_ownership(investor1, investor2, moment, bondid, count, cost) {
        const lot = {
          deadline: moment,
          new_bondholder: investor2?.address,
          bond_units: count,
          amount: cost
      };

        await this.api.tx.evercity.bondUnitLotBid(bondid, lot).signAndSend(investor1, {
            nonce: -1
        }, this.errorLogFunc);
        if (investor2 !== null) {
            await this.api.tx.evercity.bondUnitLotSettle(bondid, investor1.address, lot).signAndSend(investor2, {
                nonce: -1
            }, this.errorLogFunc);
        }
    }

    async buy_lot(investor1, investor2, moment, bondid, count, cost, private_lot) {
        const lot = {
            deadline: moment,
            new_bondholder: (typeof(private_lot) === 'undefined' || !private_lot) ? null : investor2.address,
            bond_units: count,
            amount: cost
        };

        await this.api.tx.evercity.bondUnitLotSettle(bondid, investor1.address, lot).signAndSend(investor2, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async deposit(issuer, bondid, amount) {
        await this.api.tx.evercity.bondDepositEverusd(bondid, amount).signAndSend(issuer, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async report_send(issuer, bondid, period, impact_data) {
        await this.api.tx.evercity.bondImpactReportSend(bondid, period, impact_data).signAndSend(issuer, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async report_approve(auditor, bondid, period, impact_data) {
        await this.api.tx.evercity.bondImpactReportApprove(bondid, period, impact_data).signAndSend(auditor, {
            nonce: -1
        }, this.errorLogFunc);
    }

    async withdraw_everusd(account, bondid) {
        await this.api.tx.evercity.bondWithdrawEverusd(bondid).signAndSend(
            account,
            {
                nonce: -1
            }, this.errorLogFunc
        );
    }

    async bond_redeem(issuer, bondid) {
        await this.api.tx.evercity.bondRedeem(bondid).signAndSend(issuer, {
            nonce: -1,
        }, this.errorLogFunc);
    }

    // FileSign:
    async filesign_create_file(owner, tag, filehash, file_id) {
        const ttag = this.api.createType('Vec<u8>', tag);
        const tfilehash = this.api.createType('H256', filehash);
        const tfile_id = this.api.createType('Option<FileId>', file_id);
        await this.api.tx.evercityFilesign.createNewFile(ttag, tfilehash, tfile_id).signAndSend(owner,
           this.errorLogFunc);
    }

    // Carbon Credits: 
    
    async cc_create_project(owner, standard, file_id) {
        const tstandard = this.api.createType('Standard', standard);
        const tfile_id = this.api.createType('Option<FileId>', file_id);
        await this.api.tx.evercityCarbonCredits.createProject(tstandard, tfile_id).signAndSend(owner,  
          this.errorLogFunc);
    }

    async cc_create_bond_project(owner, standard, file_id, bond_id) {
        const tstandard = this.api.createType('Standard', standard);

        const tfile_id = this.api.createType('Option<FileId>', file_id);
        await this.api.tx.evercityCarbonCredits.createBondProject(tstandard, tfile_id, bond_id).signAndSend(owner,
            this.errorLogFunc);
    }

    async get_last_cc_project_id() {
        return await this.api.query.evercityCarbonCredits.lastID();
    }

    async get_cc_project(project_id){
        return await this.api.query.evercityCarbonCredits.projectById(project_id);
    }

    async cc_assign_project_signer(owner, signer, role, project_id) {
        const tsigner = this.api.createType('AccountId', signer);
        await this.api.tx.evercityCarbonCredits.assignProjectSigner(tsigner, role, project_id).signAndSend(owner,
            this.errorLogFunc);
    }

    async cc_sign_project(acc, project_id) {
        await this.api.tx.evercityCarbonCredits.signProject(project_id).signAndSend(acc,
            this.errorLogFunc);
    }

    async cc_create_report_with_file(owner, project_id, file_id, filehash, tag, carbon_credits_count, asset_name, asset_symbol, asset_decimals) {
        const tfile_id = this.api.createType('FileId', file_id);
        const tfilehash = this.api.createType('H256', filehash);
        const ttag = this.api.createType('Vec<u8>', tag);
        const tcarbon_credits_count = this.api.createType('Balance', carbon_credits_count);
        const tasset_name = this.api.createType('Vec<u8>', asset_name);
        const tasset_symbol = this.api.createType('Vec<u8>', asset_symbol);
        const tasset_decimals = this.api.createType('u8', asset_decimals);


        await this.api.tx.evercityCarbonCredits.createAnnualReportWithFile(project_id, tfile_id, tfilehash, 
                        ttag, tcarbon_credits_count, tasset_name, tasset_symbol, tasset_decimals).signAndSend(owner,
                            this.errorLogFunc);
    }

    async cc_assign_report_signer(owner, signer, role, project_id) {
        const tsigner = this.api.createType('AccountId', signer);
        await this.api.tx.evercityCarbonCredits.assignLastAnnualReportSigner(tsigner, role, project_id).signAndSend(owner,
            this.errorLogFunc);
    }

    async cc_sign_last_report(acc, project_id) {
        await this.api.tx.evercityCarbonCredits.signLastAnnualReport(project_id).signAndSend(acc,
            this.errorLogFunc);
    }

    async cc_release_carbon_credits(owner, project_id, asset_id, new_carbon_credits_holder, min_balance){
        const tasset_id = this.api.createType('AssetId', asset_id);
        const tnew_carbon_credits_holder = this.api.createType('AccountId', new_carbon_credits_holder);
        const tmin_balance = this.api.createType('Balance', min_balance);

        await this.api.tx.evercityCarbonCredits.releaseCarbonCredits(project_id, tasset_id, tnew_carbon_credits_holder, tmin_balance).signAndSend(owner,
            this.errorLogFunc);
    }

    async transfer_carbon_credits(holder, asset_id, new_holder, amount) {
        const tasset_id = this.api.createType('AssetId', asset_id);
        const tnew_holder = this.api.createType('AccountId', new_holder);
        const tamount = this.api.createType('Balance', amount);

        await this.api.tx.evercityCarbonCredits.transferCarbonCredits(tasset_id, tnew_holder, tamount).signAndSend(holder,
            this.errorLogFunc);
    }

    async create_carbon_credits_lot(holder, asset_id, deadline, amount, price_per_item) {
        const tasset_id = this.api.createType('AssetId', asset_id);
        const lot = {
            target_bearer: null,
            deadline: deadline,
            amount: amount,
            price_per_item: price_per_item,
        };

        await this.api.tx.evercityCarbonCredits.createCarbonCreditLot(tasset_id, lot).signAndSend(holder,
            this.errorLogFunc);
    }

    async buy_carbon_credits_lot(investor, holder, asset_id, deadline, amount, price_per_item) {
        const tasset_id = this.api.createType('AssetId', asset_id);
        const tholder = this.api.createType('AccountId', holder);
        const tamount = this.api.createType('ABalance', amount);
        const lot = {
            target_bearer: null,
            deadline: deadline,
            amount: amount,
            price_per_item: price_per_item,
        };

        await this.api.tx.evercityCarbonCredits.buyCarbonCreditLotUnits(tholder, tasset_id, lot, tamount).signAndSend(investor,
            this.errorLogFunc);
    }

    async burn_carbon_credits(holder, asset_id, amount) {
        const tasset_id = this.api.createType('AssetId', asset_id);
        const tamount = this.api.createType('Balance', amount);

        await this.api.tx.evercityCarbonCredits.burnCarbonCredits(tasset_id, tamount).signAndSend(holder,
            this.errorLogFunc);
    }

    // Assets:
    async get_user_asset_info(asset_id, user) {
        const tasset_id = this.api.createType('AssetId', asset_id);
        const tuser = this.api.createType('AccountId', user);
        return await this.api.query.evercityAssets.account(tasset_id, tuser);
    }

    // Bond-Carbon Bridge:
    async release_bond_carbon_credits(issuer, project_id, asset_id) {
        const tasset_id = this.api.createType('AssetId', asset_id);

        return await this.api.tx.evercityCarbonCredits.releaseBondCarbonCredits(project_id, tasset_id).signAndSend(issuer,
            this.errorLogFunc);
    }

    create_carbon_metadata_type(obj) {
        return this.api.createType('CarbonUnitsMetadata', obj);
    }
}

async function connect() {
    const ws = process.env.WS_URL || "ws://localhost:9944";
    const wsProvider = new WsProvider(ws);

    const api = await ApiPromise.create({
        provider: wsProvider,
        types: JSON.parse(readFileSync(process.env.types || "./types.json", 'utf8'))
    });

    let o = new NodeConnection(api);
    console.log(`connected to ${ws}`);

    const unsub = await api.query.timestamp.now((now) => {
        const moment = now.toNumber();
        //console.log(`The last block has a timestamp of ${moment}`);
        let idx = o.callback.findIndex((el, idx, arr) => (el.moment > moment));

        let alarm_callback = [];
        if (idx == -1) {
            alarm_callback = o.callback;
            o.callback = [];
        } else {
            alarm_callback = o.callback.splice(0, idx);
        }

        for (let item of alarm_callback) {
            item.resolve(moment);
        }
    });

    o.unsub = unsub;
    o.day_duration = api.consts.evercity.timeStep.toNumber();
    o.accounts_master = keyring.addFromUri('//Alice', {
        name: 'Alice (accounts_master)'
    });

    // Retrieve the chain name
    const chain = await api.rpc.system.chain();

    // Retrieve the latest header
    const lastHeader = await api.rpc.chain.getHeader();
    // Log the information
    //console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
    o.lastHeader = {
        number: lastHeader.number,
        hash: lastHeader.hash
    };

    return o;
}

export default connect