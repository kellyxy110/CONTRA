#![allow(non_camel_case_types)]
use near_sdk::{borsh::{self, BorshDeserialize, BorshSerialize}, collections::LookupMap, env, near, AccountId, Gas, NearToken, PanicOnDefault, Promise, PromiseError};
use near_sdk::serde::{Deserialize, Deserializer, Serialize, Serializer};
use near_sdk::serde_json::{self, json, Value};
use std::collections::BTreeMap;

const FLOOR:u128=100_000_000_000_000_000_000_000;
const CASE_BYTES:u64=131_072;
const GLOBAL_BYTES:u64=131_072;
const SECOND:u64=1_000_000_000;

#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, BorshSerialize, BorshDeserialize)]
pub struct Hash32(pub [u8;32]);
impl Serialize for Hash32 {fn serialize<S:Serializer>(&self,s:S)->Result<S::Ok,S::Error>{s.serialize_str(&hex::encode(self.0))}}
impl<'de> Deserialize<'de> for Hash32 {fn deserialize<D:Deserializer<'de>>(d:D)->Result<Self,D::Error>{let s=<String as Deserialize>::deserialize(d)?;if s.len()!=64||!s.bytes().all(|x|x.is_ascii_digit()||(b'a'..=b'f').contains(&x)){return Err(near_sdk::serde::de::Error::custom("E_DIGEST"));}let mut v=[0;32];hex::decode_to_slice(s,&mut v).map_err(near_sdk::serde::de::Error::custom)?;Ok(Self(v))}}
macro_rules! decimal {($name:ident,$t:ty)=>{
 #[derive(Clone,Copy,Debug,Default,PartialEq,Eq,PartialOrd,Ord,BorshSerialize,BorshDeserialize)] pub struct $name(pub $t);
 impl Serialize for $name {fn serialize<S:Serializer>(&self,s:S)->Result<S::Ok,S::Error>{s.serialize_str(&self.0.to_string())}}
 impl<'de> Deserialize<'de> for $name {fn deserialize<D:Deserializer<'de>>(d:D)->Result<Self,D::Error>{let s=<String as Deserialize>::deserialize(d)?;if s.is_empty()||!s.bytes().all(|b|b.is_ascii_digit())||(s.len()>1&&s.starts_with('0')){return Err(near_sdk::serde::de::Error::custom("E_INPUT"));}Ok(Self(s.parse().map_err(near_sdk::serde::de::Error::custom)?))}}
}}
decimal!(D64,u64); decimal!(D128,u128);
macro_rules! enum_type {($name:ident { $($v:ident),+ })=>{#[derive(Clone,Copy,Debug,PartialEq,Eq,BorshSerialize,BorshDeserialize,Serialize,Deserialize)] #[serde(crate="near_sdk::serde")] pub enum $name {$($v),+}}}
enum_type!(Disposition{ACCEPT,REJECT,UNRESOLVED});
enum_type!(CriterionKind{GENERAL,KEYBOARD});
enum_type!(BaseFallback{BASE_REFUND_V1});
enum_type!(ChallengeFallback{KEEP_PRIMARY_V1});
enum_type!(State{Draft,Cancelled,Funded,Submitted,ReviewCommit,ReviewReveal,Provisional,Challenged,ChallengeReview,Unresolved,Resolved,SettlementPending,TransferFailed,Settled});
enum_type!(Phase{COMMIT,REVEAL,CLOSED});
enum_type!(Basis{PRIMARY,FRESH,BASE_REFUND,KEEP_PRIMARY});

#[derive(Clone,Debug,PartialEq,Eq,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde",deny_unknown_fields)]
pub struct Criterion {pub criterion_id:u16,pub kind:CriterionKind,pub requirement_digest:Hash32}
#[derive(Clone,Debug,PartialEq,Eq,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde",deny_unknown_fields)]
pub struct TermsInput {
 pub beneficiary_id:AccountId,pub creator_operator_id:Hash32,pub beneficiary_operator_id:Hash32,pub amount_yocto:D128,
 pub fund_by_ns:D64,pub submit_by_ns:D64,pub primary_commit_end_ns:D64,pub primary_reveal_end_ns:D64,pub challenge_end_ns:D64,pub fresh_commit_end_ns:D64,pub fresh_reveal_end_ns:D64,
 pub criteria:Vec<Criterion>,pub evidence_policy_digest:Hash32,pub policy_version:u16,pub base_fallback:BaseFallback,pub challenge_fallback:ChallengeFallback,
}
#[derive(Clone,Debug,PartialEq,Eq,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct ReviewerSnapshot{pub reviewer_id:AccountId,pub operator_id:Hash32,pub revision:D64,pub disclosure_digest:Hash32}
#[derive(Clone,Debug,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct Reviewer {#[serde(flatten)]pub snapshot:ReviewerSnapshot,pub active:bool,pub confirmed:bool}
#[derive(Clone,Debug,PartialEq,Eq,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct FrozenTerms {
 pub domain:String,pub chain_id:String,pub contract_account:AccountId,pub request_id:Hash32,pub creator_id:AccountId,
 #[serde(flatten)] pub input:TermsInput,pub primary_committee:[ReviewerSnapshot;3],pub fresh_committee:[ReviewerSnapshot;3],
}
#[derive(Clone,Debug,Default,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct Vote{pub commitment:Option<Hash32>,pub disposition:Option<Disposition>,pub finding_digest:Option<Hash32>}
#[derive(Clone,Debug,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct Challenge {pub challenger_id:AccountId,pub criterion_id:u16,pub counterexample_digest:Hash32,pub round_evidence_digest:Hash32,pub submitted_at_ns:D64}
#[derive(Clone,Debug,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct Attempt{pub attempt:u32,pub dispatched_at_ns:D64,pub result:String,pub completed_at_ns:Option<D64>}
#[derive(Clone,Debug,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct Payout{pub payout_intent_id:Hash32,pub recipient_id:AccountId,pub amount_yocto:D128,pub disposition:Disposition,pub resolution_basis:Basis,pub decision_reason:String,pub status:String,pub attempt:u32,pub last_attempt:Attempt}
#[derive(Clone,Debug,BorshSerialize,BorshDeserialize,Serialize,Deserialize)]
#[serde(crate="near_sdk::serde")]
pub struct Case {
 pub case_id:Hash32,pub creator_id:AccountId,pub request_id:Hash32,pub terms:FrozenTerms,pub terms_digest:Hash32,pub beneficiary_accepted:bool,pub funded_principal_yocto:D128,pub principal_bucket:String,
 pub state:State,pub reason:String,pub round_id:Option<u8>,pub phase:Option<Phase>,pub evidence_digest:Option<Hash32>,pub challenge:Option<Challenge>,pub primary_disposition:Option<Disposition>,pub final_disposition:Option<Disposition>,pub resolution_basis:Option<Basis>,pub decision_at_ns:Option<D64>,pub payout:Option<Payout>,pub created_at_ns:D64,pub funded_at_ns:Option<D64>,pub revision:D64,pub last_event_seq:D64,
 #[serde(default,skip_serializing)] pub rounds:[[Vote;3];2],
 #[serde(default,skip_serializing)] pub events:Vec<String>,
 #[serde(skip)] pub reserved_padding:Vec<u8>,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
 owner_id:AccountId,chain_id:String,creator_allowlist:Vec<AccountId>,registry:BTreeMap<AccountId,Reviewer>,cases:LookupMap<Hash32,Case>,case_ids:Vec<Hash32>,storage_reserved:u128,held:u128,inflight:u128,paid:u128,sponsor_total:u128,global_events:Vec<String>,global_seq:u64,callback_fault:bool,
}
fn require(ok:bool,code:&str){if !ok{env::panic_str(code)}}
fn hash<T:BorshSerialize>(v:&T)->Hash32{Hash32(env::sha256(&borsh::to_vec(v).expect("serialization")).try_into().unwrap())}
fn valid_hash(h:Hash32){require(h.0!=[0;32],"E_DIGEST")}
fn now()->u64{env::block_timestamp()}
fn caller()->AccountId{env::predecessor_account_id()}
fn deposit(n:u128){require(env::attached_deposit().as_yoctonear()==n,"E_DEPOSIT")}
fn gas(t:u64){require(env::prepaid_gas().as_gas()>=t*1_000_000_000_000,"E_GAS")}
fn inc(n:u64)->u64{n.checked_add(1).unwrap_or_else(||env::panic_str("E_OVERFLOW"))}
fn add(a:u128,b:u128)->u128{a.checked_add(b).unwrap_or_else(||env::panic_str("E_OVERFLOW"))}

#[near]
impl Contract {
 #[init]
 #[deny_unknown_arguments]
 pub fn new(owner_id:AccountId,chain_id:String,creator_allowlist:Vec<AccountId>)->Self{
  deposit(0);gas(50);require(caller()==env::current_account_id(),"E_AUTH");require(chain_id=="testnet","E_NETWORK");require(!creator_allowlist.is_empty()&&creator_allowlist.len()<=8&&creator_allowlist.windows(2).all(|w|w[0]<w[1]),"E_INPUT");
  let reserve=(env::storage_usage()+GLOBAL_BYTES) as u128*env::storage_byte_cost().as_yoctonear();require(env::account_balance().as_yoctonear()>=add(reserve,FLOOR),"E_STORAGE_RESERVE");
  Self{owner_id,chain_id,creator_allowlist,registry:BTreeMap::new(),cases:LookupMap::new(b"c"),case_ids:vec![],storage_reserved:reserve,held:0,inflight:0,paid:0,sponsor_total:env::account_balance().as_yoctonear(),global_events:vec![],global_seq:0,callback_fault:false}
 }
 #[payable]
 #[deny_unknown_arguments]
 pub fn sponsor_storage(&mut self)->Value{gas(30);require(caller()==self.owner_id,"E_AUTH");let n=env::attached_deposit().as_yoctonear();require(n>0,"E_DEPOSIT");self.sponsor_total=add(self.sponsor_total,n);self.global("reserve_sponsored",json!({"amount_yocto":n.to_string()}));self.reserves()}
 #[payable]
 #[deny_unknown_arguments]
 pub fn set_reviewer(&mut self,reviewer_id:AccountId,operator_id:Hash32,disclosure_digest:Hash32,active:bool)->Reviewer{
  gas(30);deposit(1);require(caller()==self.owner_id,"E_AUTH");valid_hash(operator_id);valid_hash(disclosure_digest);
  let rev=if let Some(r)=self.registry.get(&reviewer_id){if r.snapshot.operator_id==operator_id&&r.snapshot.disclosure_digest==disclosure_digest&&r.active==active{return r.clone()}inc(r.snapshot.revision.0)}else{require(self.registry.len()<32,"E_CAPACITY");self.reserve(4096);1};
  let r=Reviewer{snapshot:ReviewerSnapshot{reviewer_id:reviewer_id.clone(),operator_id,revision:D64(rev),disclosure_digest},active,confirmed:false};self.registry.insert(reviewer_id,r.clone());self.global("reviewer_updated",serde_json::to_value(&r).unwrap());r
 }
 #[payable]
 #[deny_unknown_arguments]
 pub fn confirm_reviewer(&mut self,revision:D64,disclosure_digest:Hash32)->Reviewer{
  gas(30);deposit(1);let id=caller();let mut r=self.registry.get(&id).cloned().unwrap_or_else(||env::panic_str("E_AUTH"));require(r.active&&r.snapshot.revision==revision&&r.snapshot.disclosure_digest==disclosure_digest,"E_COMMITTEE");if !r.confirmed{r.confirmed=true;self.registry.insert(id,r.clone());self.global("reviewer_confirmed",serde_json::to_value(&r).unwrap());}r
 }
 #[deny_unknown_arguments]
 pub fn preview_case(&self,creator_id:AccountId,request_id:Hash32,terms:TermsInput)->Value{let (id,f)=self.prepare(creator_id,request_id,terms);json!({"case_id":id,"terms_digest":hash(&f),"primary_committee":f.primary_committee,"fresh_committee":f.fresh_committee,"policy_version":1})}
 #[payable]
 #[deny_unknown_arguments]
 pub fn create_case(&mut self,request_id:Hash32,terms:TermsInput,expected_terms_digest:Hash32)->Value{
  gas(50);deposit(1);let creator=caller();require(self.creator_allowlist.contains(&creator),"E_AUTH");valid_hash(request_id);let id=self.case_key(&creator,request_id);
  if let Some(c)=self.cases.get(&id){require(c.terms.input==terms&&c.terms_digest==expected_terms_digest,"E_REQUEST_CONFLICT");return json!({"case_id":id,"terms_digest":c.terms_digest,"replayed":true})}
  require(self.case_ids.len()<128,"E_CAPACITY");let (_,f)=self.prepare(creator.clone(),request_id,terms);let digest=hash(&f);require(digest==expected_terms_digest,"E_DIGEST");self.reserve(CASE_BYTES);
  let mut c=Case{case_id:id,creator_id:creator,request_id,terms:f,terms_digest:digest,beneficiary_accepted:false,funded_principal_yocto:D128(0),principal_bucket:"UNFUNDED".into(),state:State::Draft,reason:"NONE".into(),round_id:None,phase:None,evidence_digest:None,challenge:None,primary_disposition:None,final_disposition:None,resolution_basis:None,decision_at_ns:None,payout:None,created_at_ns:D64(now()),funded_at_ns:None,revision:D64(0),last_event_seq:D64(0),rounds:std::array::from_fn(|_|std::array::from_fn(|_|Vote::default())),events:vec![],reserved_padding:vec![]};
  Self::event(&mut c,"case_created",json!({"terms_digest":digest}));self.save(&mut c);self.case_ids.push(id);json!({"case_id":id,"terms_digest":digest,"replayed":false})
 }
 #[payable]
 #[deny_unknown_arguments]
 pub fn accept_terms(&mut self,case_id:Hash32,terms_digest:Hash32)->Case{gas(30);deposit(1);let mut c=self.case(case_id);require(caller()==c.terms.input.beneficiary_id,"E_AUTH");require(c.terms_digest==terms_digest,"E_TERMS");if c.beneficiary_accepted{return c}require(c.state==State::Draft,"E_PHASE");require(now()<c.terms.input.fund_by_ns.0,"E_DEADLINE");c.beneficiary_accepted=true;Self::event(&mut c,"terms_accepted",json!({"terms_digest":terms_digest}));self.save(&mut c);c}
 #[payable]
 #[deny_unknown_arguments]
 pub fn cancel_case(&mut self,case_id:Hash32)->Case{gas(30);deposit(1);let mut c=self.case(case_id);require(caller()==c.creator_id,"E_AUTH");if c.state==State::Cancelled{return c}require(c.state==State::Draft&&c.funded_principal_yocto.0==0,"E_PHASE");c.state=State::Cancelled;c.reason="CREATOR_CANCELLED".into();let data=json!({"reason":c.reason.clone()});Self::event(&mut c,"case_cancelled",data);self.save(&mut c);c}
 #[payable]
 #[deny_unknown_arguments]
 pub fn fund_case(&mut self,case_id:Hash32,terms_digest:Hash32)->Case{
  gas(50);let mut c=self.case(case_id);require(caller()==c.creator_id,"E_AUTH");require(c.state==State::Draft,"E_PHASE");require(c.terms_digest==terms_digest,"E_TERMS");require(c.beneficiary_accepted,"E_NOT_ACCEPTED");require(now()<c.terms.input.fund_by_ns.0,"E_DEADLINE");deposit(c.terms.input.amount_yocto.0);
  for s in c.terms.primary_committee.iter().chain(c.terms.fresh_committee.iter()){let r=self.registry.get(&s.reviewer_id).unwrap_or_else(||env::panic_str("E_COMMITTEE"));require(r.active&&r.confirmed&&r.snapshot==*s,"E_COMMITTEE");}
  self.held=add(self.held,c.terms.input.amount_yocto.0);self.liquid();c.funded_principal_yocto=c.terms.input.amount_yocto;c.principal_bucket="HELD".into();c.funded_at_ns=Some(D64(now()));c.state=State::Funded;let data=json!({"amount_yocto":c.funded_principal_yocto});Self::event(&mut c,"case_funded",data);self.save(&mut c);c
 }
 #[payable]
 #[deny_unknown_arguments]
 pub fn submit_evidence(&mut self,case_id:Hash32,terms_digest:Hash32,manifest_digest:Hash32)->Case{gas(30);deposit(1);valid_hash(manifest_digest);let mut c=self.case(case_id);require(caller()==c.terms.input.beneficiary_id,"E_AUTH");require(c.terms_digest==terms_digest,"E_TERMS");if let Some(h)=c.evidence_digest{require(h==manifest_digest,"E_DUPLICATE_CONFLICT");return c}require(c.state==State::Funded,"E_PHASE");require(now()<c.terms.input.submit_by_ns.0,"E_DEADLINE");c.evidence_digest=Some(manifest_digest);c.state=State::Submitted;Self::event(&mut c,"evidence_submitted",json!({"manifest_digest":manifest_digest}));self.save(&mut c);c}
 #[deny_unknown_arguments]
 pub fn advance_round(&mut self,case_id:Hash32)->Case{gas(50);deposit(0);let mut c=self.case(case_id);if Self::advance(&mut c){let state=c.state;let phase=c.phase;Self::event(&mut c,"case_resolved",json!({"state":state,"phase":phase}));self.save(&mut c)}c}
 #[deny_unknown_arguments]
 pub fn commit_vote(&mut self,case_id:Hash32,round_id:u8,commitment:Hash32)->Value{
  gas(30);deposit(0);valid_hash(commitment);let mut c=self.case(case_id);let index=Self::member(&c,round_id);let slot=&c.rounds[round_id as usize][index];if let Some(h)=slot.commitment{require(h==commitment,"E_DUPLICATE_CONFLICT");return Self::round(&c,round_id)}
  Self::phase_check(&c,round_id,Phase::COMMIT);c.rounds[round_id as usize][index].commitment=Some(commitment);Self::event(&mut c,"vote_committed",json!({"round_id":round_id,"reviewer_id":caller(),"commitment":commitment}));self.save(&mut c);Self::round(&c,round_id)
 }
 #[deny_unknown_arguments]
 pub fn reveal_vote(&mut self,case_id:Hash32,round_id:u8,disposition:Disposition,evidence_digest:Hash32,finding_digest:Hash32,nonce:Hash32)->Value{
  gas(30);deposit(0);valid_hash(finding_digest);let mut c=self.case(case_id);let index=Self::member(&c,round_id);let expected=Self::round_digest(&c,round_id);require(expected==evidence_digest,"E_DIGEST");let h=hash(&("CONTRA:VOTE:v1".to_string(),self.chain_id.clone(),env::current_account_id(),case_id,c.terms_digest,round_id,caller(),disposition,evidence_digest,finding_digest,nonce));let v=&c.rounds[round_id as usize][index];require(v.commitment==Some(h),"E_COMMITMENT");if v.disposition.is_some(){require(v.disposition==Some(disposition)&&v.finding_digest==Some(finding_digest),"E_DUPLICATE_CONFLICT");return Self::round(&c,round_id)}
  Self::phase_check(&c,round_id,Phase::REVEAL);let v=&mut c.rounds[round_id as usize][index];v.disposition=Some(disposition);v.finding_digest=Some(finding_digest);Self::event(&mut c,"vote_revealed",json!({"round_id":round_id,"reviewer_id":caller(),"disposition":disposition,"evidence_digest":evidence_digest,"finding_digest":finding_digest}));self.save(&mut c);Self::round(&c,round_id)
 }
 #[payable]
 #[deny_unknown_arguments]
 pub fn file_challenge(&mut self,case_id:Hash32,criterion_id:u16,counterexample_digest:Hash32)->Case{
  gas(30);deposit(1);valid_hash(counterexample_digest);let mut c=self.case(case_id);if let Some(q)=&c.challenge{require(q.challenger_id==caller()&&q.criterion_id==criterion_id&&q.counterexample_digest==counterexample_digest,"E_CHALLENGE_USED");return c}
  require(c.state==State::Provisional,"E_PHASE");require(now()<c.terms.input.challenge_end_ns.0,"E_DEADLINE");let primary=c.primary_disposition.unwrap();require((primary==Disposition::ACCEPT&&caller()==c.creator_id)||(primary==Disposition::REJECT&&caller()==c.terms.input.beneficiary_id),"E_AUTH");require(c.terms.input.criteria.iter().any(|x|x.criterion_id==criterion_id),"E_INPUT");require(Some(counterexample_digest)!=c.evidence_digest,"E_DIGEST");
  let digest=hash(&("CONTRA:CHALLENGE:v1".to_string(),self.chain_id.clone(),env::current_account_id(),case_id,c.terms_digest,c.evidence_digest.unwrap(),criterion_id,counterexample_digest));c.challenge=Some(Challenge{challenger_id:caller(),criterion_id,counterexample_digest,round_evidence_digest:digest,submitted_at_ns:D64(now())});c.state=State::Challenged;c.reason="CHALLENGE_PENDING".into();Self::event(&mut c,"challenge_filed",json!({"criterion_id":criterion_id,"counterexample_digest":counterexample_digest,"round_evidence_digest":digest}));self.save(&mut c);c
 }
 #[deny_unknown_arguments]
 pub fn finalize_case(&mut self,case_id:Hash32)->Value{
  deposit(0);gas(100);let mut c=self.case(case_id);if let Some(p)=&c.payout{return json!({"kind":"EXISTING","payout":p})}Self::advance(&mut c);let t=&c.terms.input;
  match c.state{State::Provisional=>{require(now()>=t.challenge_end_ns.0&&c.challenge.is_none(),"E_NOT_ELIGIBLE");c.final_disposition=c.primary_disposition;c.resolution_basis=Some(Basis::PRIMARY);},State::Resolved|State::Unresolved=>require(now()>=t.fresh_reveal_end_ns.0,"E_NOT_ELIGIBLE"),_=>env::panic_str("E_NOT_ELIGIBLE")}
  let disposition=c.final_disposition.expect("resolved disposition");let basis=c.resolution_basis.unwrap();let recipient=if disposition==Disposition::ACCEPT{c.terms.input.beneficiary_id.clone()}else{c.creator_id.clone()};let amount=c.funded_principal_yocto;let id=hash(&("CONTRA:PAYOUT:v1".to_string(),self.chain_id.clone(),env::current_account_id(),case_id,c.terms_digest,recipient.clone(),amount,disposition,basis));c.payout=Some(Payout{payout_intent_id:id,recipient_id:recipient,amount_yocto:amount,disposition,resolution_basis:basis,decision_reason:c.reason.clone(),status:"AWAITING_RESULT".into(),attempt:0,last_attempt:Attempt{attempt:0,dispatched_at_ns:D64(0),result:"UNKNOWN".into(),completed_at_ns:None}});let d=self.dispatch(&mut c);json!({"kind":"DISPATCHED","dispatch":d})
 }
 #[deny_unknown_arguments]
 pub fn retry_payout(&mut self,case_id:Hash32,payout_intent_id:Hash32,expected_attempt:u32)->Value{deposit(0);gas(100);let mut c=self.case(case_id);require(c.state==State::TransferFailed,"E_OUTCOME_UNKNOWN");let p=c.payout.as_ref().unwrap();require(p.payout_intent_id==payout_intent_id&&p.attempt==expected_attempt,"E_ATTEMPT");require(p.last_attempt.result=="FAILED","E_OUTCOME_UNKNOWN");self.dispatch(&mut c)}
 #[private]
 #[deny_unknown_arguments]
 pub fn on_payout_complete(&mut self,case_id:Hash32,payout_intent_id:Hash32,attempt:u32)->Value{
  deposit(0);require(caller()==env::current_account_id(),"E_AUTH");require(env::promise_results_count()==1,"E_AUTH");
  #[cfg(feature="sandbox-faults")] if self.callback_fault{env::panic_str("SANDBOX_ONLY_CALLBACK_FAULT")}
  let mut c=self.case(case_id);let Some(p)=c.payout.as_mut()else{return json!({"applied":false,"state":c.state,"payout_intent_id":payout_intent_id,"attempt":attempt,"reason":"MISMATCH"})};if p.payout_intent_id!=payout_intent_id||p.attempt!=attempt||c.state!=State::SettlementPending||p.last_attempt.result!="UNKNOWN"{let reason=if p.payout_intent_id!=payout_intent_id{"MISMATCH"}else if p.attempt==attempt&&p.last_attempt.result!="UNKNOWN"{"DUPLICATE"}else{"STALE"};return json!({"applied":false,"state":c.state,"payout_intent_id":payout_intent_id,"attempt":attempt,"reason":reason})}
  let success=match env::promise_result_checked(0,0){Ok(v) if v.is_empty()=>true,Err(PromiseError::Failed)=>false,_=>return json!({"applied":false,"state":c.state,"payout_intent_id":payout_intent_id,"attempt":attempt,"reason":"UNEXPECTED_RESULT"})};let amount=p.amount_yocto.0;self.inflight=self.inflight.checked_sub(amount).expect("inflight");p.last_attempt.completed_at_ns=Some(D64(now()));if success{self.paid=add(self.paid,amount);p.last_attempt.result="SUCCESS".into();p.status="SUCCESS_VERIFIED".into();c.state=State::Settled;c.reason="CALLBACK_SUCCESS".into();c.principal_bucket="COMPLETED".into()}else{self.held=add(self.held,amount);p.last_attempt.result="FAILED".into();p.status="FAILED_VERIFIED".into();c.state=State::TransferFailed;c.reason="CALLBACK_FAILED".into();c.principal_bucket="HELD".into()}
  let state=c.state;Self::event(&mut c,"payout_result",json!({"payout_intent_id":payout_intent_id,"attempt":attempt,"result":if success{"SUCCESS"}else{"FAILED"},"state":state}));self.save(&mut c);json!({"applied":true,"state":state,"payout_intent_id":payout_intent_id,"attempt":attempt,"reason":"APPLIED"})
 }
 #[cfg(feature="sandbox-faults")]
 #[deny_unknown_arguments]
 pub fn set_callback_fault(&mut self,enabled:bool){deposit(0);require(caller()==self.owner_id,"E_AUTH");self.callback_fault=enabled;}
 #[deny_unknown_arguments]
 pub fn get_config(&self)->Value{json!({"abi_version":"1.0.0","policy_version":1,"chain_id":self.chain_id,"contract_account":env::current_account_id(),"owner_id":self.owner_id,"creator_allowlist":self.creator_allowlist,"limits":{"cases":128,"registry":32,"criteria":16},"gas_policy":{"write_tgas":30,"create_tgas":50,"payout_tgas":100,"callback_tgas":30},"reserve_summary":self.reserves()})}
 #[deny_unknown_arguments]
 pub fn get_case(&self,case_id:Hash32)->Option<Case>{self.cases.get(&case_id)}
 #[deny_unknown_arguments]
 pub fn get_creation(&self,creator_id:AccountId,request_id:Hash32)->Value{self.cases.get(&self.case_key(&creator_id,request_id)).map(|c|json!({"case_id":c.case_id,"terms_digest":c.terms_digest})).unwrap_or(Value::Null)}
 #[deny_unknown_arguments]
 pub fn get_reviewer(&self,reviewer_id:AccountId)->Option<Reviewer>{self.registry.get(&reviewer_id).cloned()}
 #[deny_unknown_arguments]
 pub fn list_reviewers(&self,from_index:D64,limit:u32)->Value{require(limit>0&&limit<=50,"E_INPUT");let items:Vec<_>=self.registry.values().skip(from_index.0 as usize).take(limit as usize).cloned().collect();let next=from_index.0+items.len() as u64;json!({"items":items,"next_index":if next<self.registry.len() as u64{Some(D64(next))}else{None}})}
 #[deny_unknown_arguments]
 pub fn list_cases(&self,from_index:D64,limit:u32)->Value{require(limit>0&&limit<=50,"E_INPUT");let items:Vec<_>=self.case_ids.iter().skip(from_index.0 as usize).take(limit as usize).map(|id|self.case(*id)).collect();let next=from_index.0+items.len() as u64;json!({"items":items,"next_index":if next<self.case_ids.len() as u64{Some(D64(next))}else{None}})}
 #[deny_unknown_arguments]
 pub fn get_committee(&self,case_id:Hash32,round_id:u8)->Value{self.cases.get(&case_id).map(|c|{require(round_id<2,"E_INPUT");json!({"members":if round_id==0{c.terms.primary_committee}else{c.terms.fresh_committee},"threshold":2,"policy_version":1})}).unwrap_or(Value::Null)}
 #[deny_unknown_arguments]
 pub fn get_round(&self,case_id:Hash32,round_id:u8)->Value{self.cases.get(&case_id).map(|c|Self::round(&c,round_id)).unwrap_or(Value::Null)}
 #[deny_unknown_arguments]
 pub fn get_payout(&self,case_id:Hash32)->Option<Payout>{self.cases.get(&case_id).and_then(|c|c.payout)}
 #[deny_unknown_arguments]
 pub fn get_events(&self,case_id:Option<Hash32>,after_seq:D64,limit:u32)->Value{require(limit>0&&limit<=50,"E_INPUT");let events=case_id.map(|id|self.case(id).events).unwrap_or_else(||self.global_events.clone());let all:Vec<Value>=events.iter().map(|s|serde_json::from_str(s).unwrap()).collect();let oldest=all.first().and_then(|v|v["data"][0]["seq"].as_str()).and_then(|s|s.parse::<u64>().ok()).unwrap_or(1);let items:Vec<Value>=all.into_iter().filter(|v|v["data"][0]["seq"].as_str().unwrap().parse::<u64>().unwrap()>after_seq.0).take(limit as usize).collect();let next=items.last().map(|v|v["data"][0]["seq"].clone()).unwrap_or(json!(after_seq));json!({"items":items,"oldest_seq":oldest.to_string(),"next_after_seq":next,"gap":after_seq.0.saturating_add(1)<oldest})}
}

impl Contract {
 fn case(&self,id:Hash32)->Case{self.cases.get(&id).unwrap_or_else(||env::panic_str("E_NOT_FOUND"))}
 fn case_key(&self,creator:&AccountId,request:Hash32)->Hash32{hash(&("CONTRA:CASE:v1".to_string(),self.chain_id.clone(),env::current_account_id(),creator,request))}
 fn prepare(&self,creator:AccountId,request:Hash32,t:TermsInput)->(Hash32,FrozenTerms){
  require(self.creator_allowlist.contains(&creator),"E_AUTH");valid_hash(request);valid_hash(t.creator_operator_id);valid_hash(t.beneficiary_operator_id);valid_hash(t.evidence_policy_digest);require(t.creator_operator_id!=t.beneficiary_operator_id&&creator!=t.beneficiary_id&&creator!=env::current_account_id()&&t.beneficiary_id!=env::current_account_id(),"E_INPUT");require(t.amount_yocto.0>0&&t.amount_yocto.0<=100_000_000_000_000_000_000_000_000&&t.policy_version==1,"E_INPUT");require(!t.criteria.is_empty()&&t.criteria.len()<=16,"E_INPUT");let mut prev=0;for x in &t.criteria{require(x.criterion_id>prev&&x.criterion_id<=16,"E_INPUT");valid_hash(x.requirement_digest);prev=x.criterion_id}
  let ts=[t.fund_by_ns.0,t.submit_by_ns.0,t.primary_commit_end_ns.0,t.primary_reveal_end_ns.0,t.challenge_end_ns.0,t.fresh_commit_end_ns.0,t.fresh_reveal_end_ns.0];require(now()<ts[0],"E_DEADLINE");require(ts.windows(2).all(|w|w[1].checked_sub(w[0]).is_some_and(|d|d>=600*SECOND&&d<=7*86400*SECOND))&&ts[6].checked_sub(now()).is_some_and(|d|d<=30*86400*SECOND),"E_DEADLINE");
  let mut selected=vec![];let mut operators=vec![];for r in self.registry.values(){let s=&r.snapshot;if r.active&&r.confirmed&&s.reviewer_id!=creator&&s.reviewer_id!=t.beneficiary_id&&s.reviewer_id!=env::current_account_id()&&s.operator_id!=t.creator_operator_id&&s.operator_id!=t.beneficiary_operator_id&&!operators.contains(&s.operator_id){operators.push(s.operator_id);selected.push(s.clone());if selected.len()==6{break}}}require(selected.len()==6,"E_COMMITTEE");let primary=selected[..3].to_vec().try_into().unwrap();let fresh=selected[3..].to_vec().try_into().unwrap();let id=self.case_key(&creator,request);(id,FrozenTerms{domain:"CONTRA:TERMS:v1".into(),chain_id:self.chain_id.clone(),contract_account:env::current_account_id(),request_id:request,creator_id:creator,input:t,primary_committee:primary,fresh_committee:fresh})
 }
 fn reserve(&mut self,bytes:u64){let n=add(self.storage_reserved,bytes as u128*env::storage_byte_cost().as_yoctonear());require(env::account_balance().as_yoctonear()>=add(add(add(n,self.held),self.inflight),FLOOR),"E_STORAGE_RESERVE");self.storage_reserved=n;}
 fn liquid(&self){require(env::account_balance().as_yoctonear()>=add(add(add(self.storage_reserved,self.held),self.inflight),FLOOR),"E_LIQUIDITY")}
 fn reserves(&self)->Value{json!({"sponsor_total_yocto":self.sponsor_total.to_string(),"storage_reserved_yocto":self.storage_reserved.to_string(),"held_escrow_yocto":self.held.to_string(),"inflight_or_unknown_yocto":self.inflight.to_string(),"paid_yocto":self.paid.to_string()})}
 fn save(&mut self,c:&mut Case){c.revision=D64(inc(c.revision.0));c.reserved_padding.clear();let used=borsh::to_vec(c).unwrap().len();require(used<=CASE_BYTES as usize,"E_STORAGE_RESERVE");c.reserved_padding.resize(CASE_BYTES as usize-used,0);self.cases.insert(&c.case_id,c);}
 fn event(c:&mut Case,name:&str,mut extra:Value){c.last_event_seq=D64(inc(c.last_event_seq.0));let m=extra.as_object_mut().unwrap();m.insert("seq".into(),json!(c.last_event_seq));m.insert("case_id".into(),json!(c.case_id));m.insert("actor_id".into(),json!(caller()));m.insert("at_ns".into(),json!(D64(now())));m.insert("block_height".into(),json!(D64(env::block_height())));m.insert("case_revision".into(),json!(D64(inc(c.revision.0))));let e=serde_json::to_string(&json!({"standard":"contra","version":"1.0.0","event":name,"data":[extra]})).unwrap();require(e.len()<=1024,"E_INPUT");env::log_str(&format!("EVENT_JSON:{e}"));if c.events.len()==64{c.events.remove(0);}c.events.push(e);}
 fn global(&mut self,name:&str,mut extra:Value){self.global_seq=inc(self.global_seq);extra["seq"]=json!(D64(self.global_seq));extra["case_id"]=Value::Null;extra["actor_id"]=json!(caller());extra["at_ns"]=json!(D64(now()));extra["block_height"]=json!(D64(env::block_height()));extra["case_revision"]=Value::Null;let e=serde_json::to_string(&json!({"standard":"contra","version":"1.0.0","event":name,"data":[extra]})).unwrap();require(e.len()<=1024,"E_INPUT");env::log_str(&format!("EVENT_JSON:{e}"));if self.global_events.len()==64{self.global_events.remove(0);}self.global_events.push(e);}
 fn member(c:&Case,r:u8)->usize{require(r<2,"E_INPUT");let committee=if r==0{&c.terms.primary_committee}else{&c.terms.fresh_committee};committee.iter().position(|s|s.reviewer_id==caller()).unwrap_or_else(||env::panic_str("E_AUTH"))}
 fn round_digest(c:&Case,r:u8)->Hash32{if r==0{c.evidence_digest.unwrap_or_else(||env::panic_str("E_PHASE"))}else{c.challenge.as_ref().map(|q|q.round_evidence_digest).unwrap_or_else(||env::panic_str("E_PHASE"))}}
 fn phase_check(c:&Case,r:u8,p:Phase){require(r<2,"E_INPUT");require(c.round_id==Some(r)&&c.phase==Some(p)&&((r==0&&(c.state==State::ReviewCommit||c.state==State::ReviewReveal))||(r==1&&c.state==State::ChallengeReview)),"E_PHASE");let t=&c.terms.input;let (ce,re)=if r==0{(t.primary_commit_end_ns.0,t.primary_reveal_end_ns.0)}else{(t.fresh_commit_end_ns.0,t.fresh_reveal_end_ns.0)};require(if p==Phase::COMMIT{now()<ce}else{now()>=ce&&now()<re},"E_DEADLINE");}
 fn counts(c:&Case,r:u8)->[u8;3]{let mut n=[0;3];for v in &c.rounds[r as usize]{if let Some(d)=v.disposition{n[d as usize]+=1}}n}
 fn round(c:&Case,r:u8)->Value{require(r<2,"E_INPUT");let committee=if r==0{&c.terms.primary_committee}else{&c.terms.fresh_committee};let n=Self::counts(c,r);let t=&c.terms.input;let evidence=if r==0{c.evidence_digest}else{c.challenge.as_ref().map(|q|q.round_evidence_digest)};json!({"case_id":c.case_id,"round_id":r,"committee":committee,"threshold":2,"phase":if c.round_id==Some(r){c.phase}else{None},"commit_end_ns":if r==0{t.primary_commit_end_ns}else{t.fresh_commit_end_ns},"reveal_end_ns":if r==0{t.primary_reveal_end_ns}else{t.fresh_reveal_end_ns},"evidence_digest":evidence,"slots":c.rounds[r as usize].iter().enumerate().map(|(i,v)|json!({"reviewer_id":committee[i].reviewer_id,"commitment":v.commitment,"revealed":v.disposition.is_some(),"disposition":v.disposition,"finding_digest":v.finding_digest})).collect::<Vec<_>>(),"counts":{"accept":n[0],"reject":n[1],"unresolved":n[2]},"closed_disposition":if c.round_id==Some(r)&&c.phase==Some(Phase::CLOSED){Some(if n[0]>=2{Disposition::ACCEPT}else if n[1]>=2{Disposition::REJECT}else{Disposition::UNRESOLVED})}else{None}})}
 fn advance(c:&mut Case)->bool{
  let old=(c.state,c.phase);let t=&c.terms.input;let n=now();match c.state{
   State::Draft if n>=t.fund_by_ns.0=>{c.state=State::Cancelled;c.reason="DRAFT_EXPIRED".into()},
   State::Funded if n>=t.submit_by_ns.0=>{c.state=State::Unresolved;c.reason="SUBMISSION_EXPIRED".into();c.final_disposition=Some(Disposition::REJECT);c.resolution_basis=Some(Basis::BASE_REFUND);c.decision_at_ns=Some(t.submit_by_ns)},
   State::Submitted|State::ReviewCommit|State::ReviewReveal=>{c.round_id=Some(0);if n>=t.primary_reveal_end_ns.0{let count=Self::counts(c,0);c.phase=Some(Phase::CLOSED);c.decision_at_ns=Some(t.primary_reveal_end_ns);let d=if count[0]>=2{Disposition::ACCEPT}else if count[1]>=2{Disposition::REJECT}else{Disposition::UNRESOLVED};c.primary_disposition=Some(d);if d!=Disposition::UNRESOLVED{c.state=State::Provisional;c.reason="PRIMARY_DECISIVE".into()}else{c.state=State::Unresolved;c.reason=if count[2]>=2{"PRIMARY_UNRESOLVED"}else{"PRIMARY_NO_QUORUM"}.into();c.final_disposition=Some(Disposition::REJECT);c.resolution_basis=Some(Basis::BASE_REFUND)}}else if n>=t.primary_commit_end_ns.0{c.state=State::ReviewReveal;c.phase=Some(Phase::REVEAL)}else{c.state=State::ReviewCommit;c.phase=Some(Phase::COMMIT)}},
   State::Challenged|State::ChallengeReview=>{c.round_id=Some(1);if n>=t.fresh_reveal_end_ns.0{let count=Self::counts(c,1);c.phase=Some(Phase::CLOSED);c.decision_at_ns=Some(t.fresh_reveal_end_ns);if count[0]>=2||count[1]>=2{c.final_disposition=Some(if count[0]>=2{Disposition::ACCEPT}else{Disposition::REJECT});c.state=State::Resolved;c.reason="FRESH_DECISIVE".into();c.resolution_basis=Some(Basis::FRESH)}else{c.state=State::Unresolved;c.final_disposition=c.primary_disposition;c.resolution_basis=Some(Basis::KEEP_PRIMARY);c.reason=if count[2]>=2{"FRESH_UNRESOLVED_KEEP_PRIMARY"}else{"FRESH_NO_QUORUM_KEEP_PRIMARY"}.into()}}else{c.state=State::ChallengeReview;c.phase=Some(if n>=t.fresh_commit_end_ns.0{Phase::REVEAL}else{Phase::COMMIT})}},_=>{}
  }old!=(c.state,c.phase)
 }
 fn dispatch(&mut self,c:&mut Case)->Value{
  require(env::prepaid_gas().as_gas().saturating_sub(env::used_gas().as_gas())>=70_000_000_000_000,"E_GAS");self.liquid();let p=c.payout.as_mut().unwrap();require(p.recipient_id!=env::current_account_id()&&p.amount_yocto.0>0,"E_INPUT");p.attempt=p.attempt.checked_add(1).unwrap_or_else(||env::panic_str("E_OVERFLOW"));p.status="AWAITING_RESULT".into();p.last_attempt=Attempt{attempt:p.attempt,dispatched_at_ns:D64(now()),result:"UNKNOWN".into(),completed_at_ns:None};let p=p.clone();self.held=self.held.checked_sub(p.amount_yocto.0).expect("held");self.inflight=add(self.inflight,p.amount_yocto.0);c.state=State::SettlementPending;c.principal_bucket="INFLIGHT_UNKNOWN".into();Self::event(c,"payout_dispatched",json!({"payout_intent_id":p.payout_intent_id,"attempt":p.attempt,"recipient_id":p.recipient_id,"amount_yocto":p.amount_yocto,"disposition":p.disposition,"resolution_basis":p.resolution_basis}));self.save(c);
  let _promise=Promise::new(p.recipient_id).transfer(NearToken::from_yoctonear(p.amount_yocto.0)).then(Promise::new(env::current_account_id()).function_call("on_payout_complete",serde_json::to_vec(&json!({"case_id":c.case_id,"payout_intent_id":p.payout_intent_id,"attempt":p.attempt})).unwrap(),NearToken::from_yoctonear(0),Gas::from_tgas(30)));
  json!({"case_id":c.case_id,"payout_intent_id":p.payout_intent_id,"attempt":p.attempt,"state":c.state,"replayed":false})
 }
}

#[cfg(test)]
mod tests {
 use super::*;use near_sdk::{testing_env,PromiseResult};use near_sdk::test_utils::{VMContextBuilder,get_created_receipts};
 fn aid(s:&str)->AccountId{s.parse().unwrap()}
 fn context(who:&str,time:u64,amount:u128)->near_sdk::VMContext{VMContextBuilder::new().current_account_id(aid("contra.testnet")).predecessor_account_id(aid(who)).signer_account_id(aid(who)).block_timestamp(time).account_balance(NearToken::from_near(10000)).attached_deposit(NearToken::from_yoctonear(amount)).prepaid_gas(Gas::from_tgas(300)).build()}
 fn ctx(who:&str,time:u64,amount:u128){testing_env!(context(who,time,amount))}
 fn fixture()->(Contract,Case){
  ctx("contra.testnet",0,0);near_sdk::mock::with_mocked_blockchain(|b|{b.take_storage();});let mut k=Contract::new(aid("creator.testnet"),"testnet".into(),vec![aid("creator.testnet")]);
  for i in 0..6{ctx("creator.testnet",0,1);let id=format!("reviewer{i}.testnet");k.set_reviewer(aid(&id),Hash32([i+10;32]),Hash32([i+20;32]),true);ctx(&id,0,1);k.confirm_reviewer(D64(1),Hash32([i+20;32]));}
  let t=TermsInput{beneficiary_id:aid("beneficiary.testnet"),creator_operator_id:Hash32([1;32]),beneficiary_operator_id:Hash32([2;32]),amount_yocto:D128(10u128.pow(24)),fund_by_ns:D64(1200*SECOND),submit_by_ns:D64(2400*SECOND),primary_commit_end_ns:D64(3600*SECOND),primary_reveal_end_ns:D64(4800*SECOND),challenge_end_ns:D64(6000*SECOND),fresh_commit_end_ns:D64(7200*SECOND),fresh_reveal_end_ns:D64(8400*SECOND),criteria:vec![Criterion{criterion_id:1,kind:CriterionKind::KEYBOARD,requirement_digest:Hash32([7;32])}],evidence_policy_digest:Hash32([8;32]),policy_version:1,base_fallback:BaseFallback::BASE_REFUND_V1,challenge_fallback:ChallengeFallback::KEEP_PRIMARY_V1};
  ctx("creator.testnet",0,1);let (id,f)=k.prepare(aid("creator.testnet"),Hash32([9;32]),t.clone());k.create_case(Hash32([9;32]),t,hash(&f));let c=k.case(id);(k,c)
 }
 fn funded()->(Contract,Case){let (mut k,c)=fixture();ctx("beneficiary.testnet",0,1);k.accept_terms(c.case_id,c.terms_digest);ctx("creator.testnet",0,c.terms.input.amount_yocto.0);let c=k.fund_case(c.case_id,c.terms_digest);(k,c)}
 fn primary()->(Contract,Case){let (mut k,c)=funded();ctx("beneficiary.testnet",0,1);k.submit_evidence(c.case_id,c.terms_digest,Hash32([30;32]));ctx("keeper.testnet",0,0);k.advance_round(c.case_id);vote(&mut k,c.case_id,0,Disposition::ACCEPT);let c=k.case(c.case_id);(k,c)}
 fn vote(k:&mut Contract,id:Hash32,r:u8,d:Disposition){let c=k.case(id);let members=if r==0{c.terms.primary_committee.clone()}else{c.terms.fresh_committee.clone()};let ce=if r==0{c.terms.input.primary_commit_end_ns.0}else{c.terms.input.fresh_commit_end_ns.0};let re=if r==0{c.terms.input.primary_reveal_end_ns.0}else{c.terms.input.fresh_reveal_end_ns.0};for m in members.iter().take(2){ctx(m.reviewer_id.as_str(),ce-SECOND,0);let h=hash(&("CONTRA:VOTE:v1".to_string(),"testnet".to_string(),aid("contra.testnet"),id,c.terms_digest,r,m.reviewer_id.clone(),d,Contract::round_digest(&c,r),Hash32([31;32]),Hash32([32;32])));k.commit_vote(id,r,h);}ctx("keeper.testnet",ce,0);k.advance_round(id);for m in members.iter().take(2){ctx(m.reviewer_id.as_str(),ce,0);k.reveal_vote(id,r,d,Contract::round_digest(&c,r),Hash32([31;32]),Hash32([32;32]));}ctx("keeper.testnet",re,0);k.advance_round(id);}
 #[test]fn consent_funding_and_unique_creation(){let(mut k,c)=fixture();ctx("creator.testnet",0,1);let v=k.create_case(c.request_id,c.terms.input.clone(),c.terms_digest);assert_eq!(v["replayed"],true);assert_eq!(k.case_ids.len(),1);ctx("beneficiary.testnet",0,1);k.accept_terms(c.case_id,c.terms_digest);ctx("creator.testnet",0,c.terms.input.amount_yocto.0);k.fund_case(c.case_id,c.terms_digest);assert_eq!(k.held,c.terms.input.amount_yocto.0);assert_eq!(k.case(c.case_id).state,State::Funded);}
 #[test]fn cancel_only_unfunded(){let(mut k,c)=fixture();ctx("creator.testnet",0,1);assert_eq!(k.cancel_case(c.case_id).state,State::Cancelled);assert_eq!(k.held,0);}
 #[test]#[should_panic(expected="E_NOT_ACCEPTED")]fn cannot_fund_without_consent(){let(mut k,c)=fixture();ctx("creator.testnet",0,c.terms.input.amount_yocto.0);k.fund_case(c.case_id,c.terms_digest);}
 #[test]#[should_panic(expected="E_PHASE")]fn cannot_cancel_funded(){let(mut k,c)=funded();ctx("creator.testnet",0,1);k.cancel_case(c.case_id);}
 #[test]#[should_panic(expected="E_AUTH")]fn unauthorized_cancel(){let(mut k,c)=fixture();ctx("outsider.testnet",0,1);k.cancel_case(c.case_id);}
 #[test]#[should_panic(expected="E_DEPOSIT")]fn wrong_funding_amount(){let(mut k,c)=fixture();ctx("beneficiary.testnet",0,1);k.accept_terms(c.case_id,c.terms_digest);ctx("creator.testnet",0,1);k.fund_case(c.case_id,c.terms_digest);}
 #[test]fn quorum_and_callback_success_are_distinct(){let(mut k,c)=primary();assert_eq!(c.state,State::Provisional);ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);let p=k.case(c.case_id).payout.unwrap();assert_eq!(k.case(c.case_id).state,State::SettlementPending);assert_eq!(get_created_receipts().len(),2);testing_env!(context("contra.testnet",6001*SECOND,0),near_sdk::test_vm_config(),near_sdk::RuntimeFeesConfig::test(),std::collections::HashMap::default(),vec![PromiseResult::Successful(vec![])]);k.on_payout_complete(c.case_id,p.payout_intent_id,1);assert_eq!(k.case(c.case_id).state,State::Settled);assert_eq!(k.paid,c.terms.input.amount_yocto.0);assert_eq!(k.inflight,0);let again=k.on_payout_complete(c.case_id,p.payout_intent_id,1);assert_eq!(again["applied"],false);assert_eq!(k.paid,c.terms.input.amount_yocto.0);}
 #[test]fn unknown_payout_cannot_dispatch_twice(){let(mut k,c)=primary();ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);ctx("keeper.testnet",7000*SECOND,0);let v=k.finalize_case(c.case_id);assert_eq!(v["kind"],"EXISTING");assert!(get_created_receipts().is_empty());assert_eq!(k.case(c.case_id).payout.unwrap().last_attempt.result,"UNKNOWN");}
 #[test]#[should_panic(expected="E_OUTCOME_UNKNOWN")]fn unknown_payout_retry_rejected(){let(mut k,c)=primary();ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);let p=k.case(c.case_id).payout.unwrap();ctx("keeper.testnet",7000*SECOND,0);k.retry_payout(c.case_id,p.payout_intent_id,1);}
 #[test]fn authentic_failed_result_allows_same_intent_retry(){let(mut k,c)=primary();ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);let p=k.case(c.case_id).payout.unwrap();testing_env!(context("contra.testnet",6001*SECOND,0),near_sdk::test_vm_config(),near_sdk::RuntimeFeesConfig::test(),std::collections::HashMap::default(),vec![PromiseResult::Failed]);k.on_payout_complete(c.case_id,p.payout_intent_id,1);assert_eq!(k.case(c.case_id).state,State::TransferFailed);ctx("keeper.testnet",7000*SECOND,0);k.retry_payout(c.case_id,p.payout_intent_id,1);let q=k.case(c.case_id).payout.unwrap();assert_eq!(q.attempt,2);assert_eq!(q.payout_intent_id,p.payout_intent_id);assert_eq!(q.amount_yocto,p.amount_yocto);assert_eq!(q.recipient_id,p.recipient_id);}
 #[test]fn fresh_review_overturns_primary(){let(mut k,c)=primary();ctx("creator.testnet",4801*SECOND,1);k.file_challenge(c.case_id,1,Hash32([40;32]));ctx("keeper.testnet",4801*SECOND,0);k.advance_round(c.case_id);vote(&mut k,c.case_id,1,Disposition::REJECT);let q=k.case(c.case_id);assert_eq!(q.state,State::Resolved);assert_eq!(q.final_disposition,Some(Disposition::REJECT));assert_eq!(q.resolution_basis,Some(Basis::FRESH));}
 #[test]fn timeout_challenge_keeps_prior_recipient(){let(mut k,c)=primary();ctx("creator.testnet",4801*SECOND,1);k.file_challenge(c.case_id,1,Hash32([40;32]));ctx("keeper.testnet",8400*SECOND,0);let q=k.advance_round(c.case_id);assert_eq!(q.state,State::Unresolved);assert_eq!(q.final_disposition,Some(Disposition::ACCEPT));assert_eq!(q.resolution_basis,Some(Basis::KEEP_PRIMARY));}
 #[test]fn voting_fixture_matches_golden(){ctx("contra.testnet",0,0);let h=hash(&("CONTRA:VOTE:v1".to_string(),"testnet".to_string(),aid("contra.testnet"),Hash32([0x44;32]),Hash32([0x11;32]),0u8,aid("reviewer-a.testnet"),Disposition::ACCEPT,Hash32([0x22;32]),Hash32([0x33;32]),Hash32(std::array::from_fn(|i|i as u8))));assert_eq!(hex::encode(h.0),"699b4c6db3682d7d671ac420251073d8008bc46fa0fcb4852b4c1f7a79a5a63c");}
 #[test]fn creation_terms_and_payout_match_shared_golden_vectors(){ctx("contra.testnet",0,0);let doc=include_str!("../../../docs/COMMITMENT_TEST_VECTORS.md");let raw=doc.split("```json\n").nth(2).unwrap().split("\n```").next().unwrap();let g:Value=serde_json::from_str(raw).unwrap();let mut input=g["terms_input"].clone();let m=input.as_object_mut().unwrap();m.insert("domain".into(),json!("CONTRA:TERMS:v1"));for name in ["chain_id","contract_account","request_id","creator_id"]{m.insert(name.into(),g["key"][name].clone());}for name in ["primary_committee","fresh_committee"]{m.insert(name.into(),g[name].clone());}let frozen:FrozenTerms=serde_json::from_value(input).unwrap();assert_eq!(json!(hash(&frozen)),g["payout_intent"]["terms_digest"]);let id=hash(&("CONTRA:CASE:v1".to_string(),frozen.chain_id.clone(),frozen.contract_account.clone(),frozen.creator_id.clone(),frozen.request_id));assert_eq!(json!(id),g["payout_intent"]["case_id"]);let p=&g["payout_intent"];let intent=hash(&("CONTRA:PAYOUT:v1".to_string(),frozen.chain_id.clone(),frozen.contract_account.clone(),id,hash(&frozen),aid(p["recipient_id"].as_str().unwrap()),serde_json::from_value::<D128>(p["amount_yocto"].clone()).unwrap(),serde_json::from_value::<Disposition>(p["disposition"].clone()).unwrap(),serde_json::from_value::<Basis>(p["resolution_basis"].clone()).unwrap()));assert_eq!(hex::encode(intent.0),"124236de5e8e68eb3f366382b4c5b0e8d335ecfc83543cb6e2c647ae9415ba9c");}
 #[test]fn wire_rejects_noncanonical_numbers(){assert!(serde_json::from_str::<D128>("\"01\"").is_err());assert!(serde_json::from_str::<D128>("1").is_err());assert!(serde_json::from_str::<Hash32>(&format!("\"{}\"","AA".repeat(32))).is_err());}
 #[test]#[should_panic(expected="E_AUTH")]fn forged_callback_is_rejected(){let(mut k,c)=primary();ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);let p=k.case(c.case_id).payout.unwrap();testing_env!(context("outsider.testnet",6001*SECOND,0),near_sdk::test_vm_config(),near_sdk::RuntimeFeesConfig::test(),std::collections::HashMap::default(),vec![PromiseResult::Successful(vec![])]);k.on_payout_complete(c.case_id,p.payout_intent_id,1);}
 #[test]fn mismatched_callback_preserves_unknown_and_ledger(){let(mut k,c)=primary();ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);testing_env!(context("contra.testnet",6001*SECOND,0),near_sdk::test_vm_config(),near_sdk::RuntimeFeesConfig::test(),std::collections::HashMap::default(),vec![PromiseResult::Successful(vec![])]);let v=k.on_payout_complete(c.case_id,Hash32([99;32]),1);assert_eq!(v["applied"],false);assert_eq!(k.paid,0);assert_eq!(k.inflight,c.terms.input.amount_yocto.0);assert_eq!(k.case(c.case_id).state,State::SettlementPending);}
 #[test]fn case_storage_is_preallocated_and_callback_cannot_grow_it(){let(mut k,c)=primary();assert_eq!(borsh::to_vec(&k.case(c.case_id)).unwrap().len(),CASE_BYTES as usize);ctx("keeper.testnet",6000*SECOND,0);k.finalize_case(c.case_id);let p=k.case(c.case_id).payout.unwrap();let before=env::storage_usage();testing_env!(context("contra.testnet",6001*SECOND,0),near_sdk::test_vm_config(),near_sdk::RuntimeFeesConfig::test(),std::collections::HashMap::default(),vec![PromiseResult::Successful(vec![])]);let pre=env::storage_usage();k.on_payout_complete(c.case_id,p.payout_intent_id,1);assert_eq!(env::storage_usage(),pre);assert!(before>0);assert_eq!(borsh::to_vec(&k.case(c.case_id)).unwrap().len(),CASE_BYTES as usize);}
 #[test]#[should_panic(expected="E_AUTH")]fn nonmember_cannot_commit(){let(mut k,c)=funded();ctx("beneficiary.testnet",0,1);k.submit_evidence(c.case_id,c.terms_digest,Hash32([30;32]));ctx("outsider.testnet",0,0);k.advance_round(c.case_id);k.commit_vote(c.case_id,0,Hash32([55;32]));}
 #[test]#[should_panic(expected="E_COMMITTEE")]fn stale_registry_snapshot_prevents_funding(){let(mut k,c)=fixture();ctx("beneficiary.testnet",0,1);k.accept_terms(c.case_id,c.terms_digest);ctx("creator.testnet",0,1);k.set_reviewer(c.terms.primary_committee[0].reviewer_id.clone(),Hash32([88;32]),Hash32([89;32]),true);ctx("creator.testnet",0,c.terms.input.amount_yocto.0);k.fund_case(c.case_id,c.terms_digest);}
}
