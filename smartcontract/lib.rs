use std::convert::TryInto; // Add this import
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// Macro to enforce conditions
macro_rules! require {
    ($cond:expr, $err:expr) => {
        if !$cond {
            return Err($err);
        }
    };
}

#[derive(Debug, Default)]
pub struct Poll {
    pub id: u32,
    pub poll_hash: [u8; 32],
    pub owner: Pubkey,
    pub price: u64,
    pub is_for_sale: bool,
    pub analytics_count: u32,
}

impl Poll {
    pub fn new(id: u32, poll_hash: [u8; 32], owner: Pubkey, price: u64) -> Self {
        Poll {
            id,
            poll_hash,
            owner,
            price,
            is_for_sale: true,
            analytics_count: 0,
        }
    }
}

pub fn create_poll(
    id: u32,
    poll_hash: [u8; 32],
    owner: Pubkey,
    price: u64,
) -> Result<Poll, ProgramError> {
    require!(price > 0, ProgramError::InvalidArgument);
    Ok(Poll::new(id, poll_hash, owner, price))
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Starting contract execution");
    let account_info_iter = &mut accounts.iter();
    let payer_account = next_account_info(account_info_iter)?;

    // Example Instruction Handler
    if instruction_data[0] == 0 {
        // Create Poll Instruction
        let id = instruction_data[1] as u32;
        let poll_hash: [u8; 32] = instruction_data[2..34].try_into().unwrap(); // Fixed
        let price = u64::from_le_bytes(instruction_data[34..42].try_into().unwrap()); // Fixed
        let poll = create_poll(id, poll_hash, *payer_account.key, price)?;
        msg!("Poll created: {:?}", poll);
    }

    Ok(())
}
