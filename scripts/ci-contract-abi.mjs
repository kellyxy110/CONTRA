import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..'),baseline=JSON.parse(fs.readFileSync(path.join(root,'ci/contract-abi-baseline.json'))),target=path.join(root,'contracts/adjudication/target/wasm32-unknown-unknown'),productionFile=path.join(target,'release/contra_adjudication.wasm'),read=file=>WebAssembly.Module.exports(new WebAssembly.Module(fs.readFileSync(file))).map(v=>v.name).sort(),production=read(productionFile),fault=read(path.join(target,'faults.wasm')),expectedProduction=[...baseline.production_exports].sort(),expectedFault=[...baseline.production_exports,...baseline.fault_only_exports].sort();
const productionHash=createHash('sha256').update(fs.readFileSync(productionFile)).digest('hex');if(productionHash!==baseline.ci_formatted_production_wasm_sha256)throw Error(`Production Wasm hash changed: ${productionHash}`);
if(JSON.stringify(production)!==JSON.stringify(expectedProduction))throw Error(`Production ABI changed.\nExpected: ${expectedProduction.join(',')}\nActual: ${production.join(',')}`);
if(JSON.stringify(fault)!==JSON.stringify(expectedFault))throw Error(`Fault-build ABI changed.\nExpected: ${expectedFault.join(',')}\nActual: ${fault.join(',')}`);
const abi=fs.readFileSync(path.join(root,'docs/CONTRACT_ABI_V1.md'),'utf8');for(const method of expectedProduction.filter(v=>v!=='memory'&&v!=='contract_source_metadata'))if(!abi.includes(`| ${method} |`)&&!abi.includes(`\`${method}(`)&&!['get_case','get_committee','get_config','get_creation','get_events','get_payout','get_reviewer','get_round','list_cases','list_reviewers','preview_case'].includes(method))throw Error(`ABI document does not name contract method ${method}`);
console.log(`Contract ABI matches ${baseline.source_commit}: ${production.length} production exports and ${baseline.fault_only_exports.length} fault-only exports.`);
