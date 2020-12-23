import connect from './api.js';
import {
    Keyring
} from '@polkadot/api';
export let api = await connect();

const keyring = new Keyring({
    type: 'sr25519'
});

export const master = keyring.addFromUri('gallery suffer express depend kite math rich exclude vanish minor risk auction', {
    name: 'MASTER (master)'
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