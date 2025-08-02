use hdk::prelude::*;

#[hdk_entry_types]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
    #[entry_type]
    Message(Message),
}

#[hdk_entry_helper]
#[derive(Clone)]
pub struct Message {
    pub content: String,
    pub timestamp: Timestamp,
}

#[hdk_extern]
pub fn send_message(content: String) -> ExternResult<ActionHash> {
    let message = Message {
        content,
        timestamp: sys_time()?,
    };
    create_entry(EntryTypes::Message(message))
}

#[hdk_extern]
pub fn get_messages(_: ()) -> ExternResult<Vec<Message>> {
    let filter = ChainQueryFilter::new().entry_type(UnitEntryTypes::Message.try_into()?);
    let records = query(filter)?;
    let messages = records
        .into_iter()
        .filter_map(|record| {
            record
                .entry()
                .to_app_option::<Message>()
                .ok()
                .flatten()
        })
        .collect();
    Ok(messages)
}
