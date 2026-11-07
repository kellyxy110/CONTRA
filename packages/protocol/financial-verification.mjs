import {financialCategories} from '../../tests/financial-categories.mjs';
export function p0Complete({checks,categories,callbackGas,gasViolations,fullSuitePassed,matrixPassed,receiptCount,sdkRequiredPassed}){
 const expected=new Set(financialCategories.map(c=>c.id));
 const required=['rust-sdk','services','wasm-build','wallet-build','sandbox-preflight','full-corrected-suite','financial-matrix'];
 return required.every(name=>checks.some(c=>c.name===name&&c.passed))&&checks.every(c=>c.passed)&&sdkRequiredPassed===true&&fullSuitePassed===true&&matrixPassed===true&&receiptCount>0&&BigInt(callbackGas||0)>0n&&gasViolations.length===0&&categories.length===18&&new Set(categories.map(c=>c.id)).size===18&&categories.every(c=>expected.has(c.id)&&c.status==='PASS'&&c.transactions>0&&c.observations?.length>=2);
}
