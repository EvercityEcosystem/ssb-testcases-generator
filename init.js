import connect from './api.js';
import {
    Keyring
} from '@polkadot/api';
export let api = await connect();

const keyring = new Keyring({
    type: 'sr25519'
});

//replace with keyring.addFromUri("//Alice") if use with IPCI chain
export const bond_emitter = keyring.addFromUri('gallery suffer express depend kite math rich exclude vanish minor risk auction', {
    name: 'bond_emitter'
});
export const custodian = keyring.addFromUri('feature wagon lunar ready topic turkey video firm minute quote critic card', {
    name: 'custodian'
});
export const auditor = keyring.addFromUri('border system idle nut era skate course attract good scrub cricket load', {
    name: 'auditor'
});
export const manager = keyring.addFromUri('hole planet enjoy kingdom jealous north tell economy cream kiwi person arrive', {
    name: 'manager'
});
export const issuer = keyring.addFromUri('where annual glory source ten universe attitude reflect quantum usage snap detect', {
    name: 'issuer'
});
export const investor1 = keyring.addFromUri('someone gold unit daughter stairs antenna crazy scorpion total rhythm dish arm', {
    name: 'investor1'
});
export const investor2 = keyring.addFromUri('near country below huge eagle salmon solar twelve aim admit glove hospital', {
    name: 'investor2'
});
export const investor3 = keyring.addFromUri('crack unhappy mistake absurd funny desk draft awful sport winner clerk force', {
    name: 'investor3'
});
export const superissuer = keyring.addFromUri('//SuperIssuer', {
    name: 'issuer+investor'
});
// Carbon credits:
export const accounts_master = keyring.addFromUri('globe position noodle charge team yellow tip method hole culture concert tongue', {
    name: 'ACCOUNTS_MASTER (accounts_master)'
});
export const cc_project_owner = keyring.addFromUri('draw math page shield discover faith fee install drip recipe dove glance', {
    name: 'cc_project_owner'
});
export const cc_auditor = keyring.addFromUri('supreme toast fabric poem since above oblige then gesture improve suffer song', {
    name: 'cc_auditor'
});
export const cc_standard = keyring.addFromUri('patient electric trouble visa wire spoon tank open cannon bright pear glare', {
    name: 'сс_standard'
});
export const cc_registry = keyring.addFromUri('also strategy rapid public special viable drip slogan same own shrimp wrong', {
    name: 'cc_registry'
});
export const cc_investor = keyring.addFromUri('genre tennis warrior zone argue debate float diary material sense paddle luxury', {
    name: 'cc_investor'
});