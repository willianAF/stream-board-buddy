using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;

/// <summary>
/// Delete a message from the global Messages variable.
/// Aguments: messageId (Guid)
/// </summary>
public class CPHInline
{
	public bool Execute()
	{
		CPH.TryGetArg("messageId", out Guid id);

		if (id == Guid.Empty)
			return true;

		var jsonMessages = CPH.GetGlobalVar<string>("Messages");
		
		if (string.IsNullOrWhiteSpace(jsonMessages))
			return true;

		var messages = JsonConvert.DeserializeObject<MessageList>(jsonMessages);

		var existentMessage = messages.Messages.FirstOrDefault(x => x.Id == id);

		if (existentMessage == null)
			return true;

		messages.Messages.Remove(existentMessage);

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