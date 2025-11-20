using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;

/// <summary>
/// Update an existent message in the global Messages variable.
/// Aguments: updated message (string, JSON serialized Message)
/// </summary>
public class CPHInline
{
	public bool Execute()
	{
		CPH.TryGetArg("message", out string jsonMessage);

		if (jsonMessage == null || string.IsNullOrWhiteSpace(jsonMessage))
			return true;

		var jsonMessages = CPH.GetGlobalVar<string>("Messages");

		var messages = new MessageList();
		
		if (string.IsNullOrWhiteSpace(jsonMessages))
			return true;

		messages = JsonConvert.DeserializeObject<MessageList>(jsonMessages);
		var editMessage = JsonConvert.DeserializeObject<Message>(jsonMessage);
		
		var oldMessage = messages.Messages.FirstOrDefault(x => x.Id == editMessage.Id);
		if (oldMessage == null)
			return true;

		oldMessage.Text = editMessage.Text;
		oldMessage.Active = editMessage.Active;

		var settings = new JsonSerializerSettings
		{
			ContractResolver = new DefaultContractResolver
			{
				NamingStrategy = new CamelCaseNamingStrategy()
			}
		};

		var updatedMessages = JsonConvert.SerializeObject(messages, settings);
		
		CPH.SetGlobalVar("Messages", updatedMessages, true);

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