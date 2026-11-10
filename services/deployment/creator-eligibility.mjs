const ACCOUNT=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

export function assessCreatorEligibility(config){
 const contract=String(config?.contract_account||'');
 const allowlist=Array.isArray(config?.creator_allowlist)?config.creator_allowlist:[];
 const eligible=allowlist.filter(account=>ACCOUNT.test(account)&&account!==contract);
 const invalid=allowlist.filter(account=>!ACCOUNT.test(account));
 const contractListed=allowlist.includes(contract);
 return {
  contract_account:contract,
  creator_allowlist:[...allowlist],
  eligible_creators:eligible,
  invalid_accounts:invalid,
  contract_account_listed:contractListed,
  can_create_case:eligible.length>0,
  blocker:eligible.length?null:'No allowlisted account can satisfy the contract rule that a creator must differ from the contract account.'
 };
}

export function requireCreatorEligibility(config){
 const result=assessCreatorEligibility(config);
 if(!result.can_create_case)throw new Error(result.blocker);
 return result;
}
