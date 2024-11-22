use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// Define Poll struct for poll data
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Poll {
    pub id: u32,
    pub question: String,
    pub options: Vec<String>,
}

// Define account data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreetingAccount {
    pub counter: u32,
}

// Declare the entrypoint
entrypoint!(process_instruction);

// Implement the instruction processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Starting instruction processing.");

    let (instruction, poll_data) = parse_instruction(instruction_data)?;

    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    match instruction {
        "createPoll" => create_poll(account, poll_data, program_id),
        "updateAnalytics" => update_analytics(account, 42), // Example: passing 42 as analytics data
        _ => {
            msg!("Unsupported instruction.");
            Err(ProgramError::InvalidInstructionData)
        }
    }
}

// Parse instruction data
fn parse_instruction(_data: &[u8]) -> Result<(&str, Poll), ProgramError> {
    // Dummy parser for demonstration
    let instruction = "createPoll";
    let poll = Poll {
        id: 1,
        question: "Example poll?".to_string(),
        options: vec!["Option 1".to_string(), "Option 2".to_string()],
    };
    Ok((instruction, poll))
}

// Function to create a poll
fn create_poll(
    account: &AccountInfo,
    poll_data: Poll,
    program_id: &Pubkey,
) -> ProgramResult {
    if account.owner != program_id {
        msg!("Account does not have the correct program id.");
        return Err(ProgramError::IncorrectProgramId);
    }

    msg!(
        "Creating poll with ID: {}, Question: {}",
        poll_data.id,
        poll_data.question
    );
    Ok(())
}

// Function to update analytics
fn update_analytics(account: &AccountInfo, new_count: u32) -> ProgramResult {
    if account.owner != account.owner {
        msg!("Account does not have the correct program id.");
        return Err(ProgramError::IncorrectProgramId);
    }

    let mut greeting_account = GreetingAccount::try_from_slice(&account.data.borrow())?;
    greeting_account.counter += new_count;
    greeting_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Updated analytics count to: {}", greeting_account.counter);
    Ok(())
}
