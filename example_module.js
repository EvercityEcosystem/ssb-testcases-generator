import { api, investor1, investor2, investor3 } from './init.js'

export default async function run(){
    const now = await api.now();
    console.log(`exmaple_module now=${now}`);
}