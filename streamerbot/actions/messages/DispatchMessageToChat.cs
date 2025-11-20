using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;

/// <summary>
/// Dispatch a random active message from the global Messages variable to chat.
/// </summary>
public class CPHInline
{
    public bool Execute()
    {
        string lastUserMessage = CPH.GetGlobalVar<string>("lastUserMessage", true);

        // TODO: Add in global vars and add possibility to add in Streamer Dashboard 
        if(lastUserMessage == "1290812164")
            return true;

        var jsonMessages = CPH.GetGlobalVar<string>("Messages");

        var messages = new MessageList();
        
        if (string.IsNullOrWhiteSpace(jsonMessages))
            return true;

        messages = JsonConvert.DeserializeObject<MessageList>(jsonMessages);
		
        Random random = new Random();
        int globalRandomIndex = CPH.GetGlobalVar<int>("lastBotMessage", true);
        int randomIndex;

        do
        {
            randomIndex = random.Next(0, messages.Messages.Count);
        } while(randomIndex == globalRandomIndex || !messages.Messages[randomIndex].Active);

        CPH.SetGlobalVar("lastBotMessage", randomIndex, true);
        CPH.SendMessage(messages.Messages[randomIndex].Text, true, true);
        return true;
    }
}

public class Message 
{
	public Guid Id { get; set; }
	public string Text { get; set; }
	public bool Active { get; set; }
}

public class MessageList
{
	public List<Message> Messages { get; set; } = new List<Message>();
}