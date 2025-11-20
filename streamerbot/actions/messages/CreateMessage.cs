	using System;
	using System.Collections.Generic;
	using Newtonsoft.Json;
	using Newtonsoft.Json.Serialization;

    /// <summary>
    /// Create a new message and add it to the global Messages variable.
    /// Aguments: message (string, JSON serialized CreateMessageDto)
    /// </summary>
	public class CPHInline
	{
		public bool Execute()
		{
			CPH.TryGetArg("message", out string jsonMessage);

			if (jsonMessage == null || string.IsNullOrWhiteSpace(jsonMessage))
				return true;

			var jsonMessages = CPH.GetGlobalVar<string>("Messages");

			var messages = new MessageList() {  };

			if (jsonMessages != null && !string.IsNullOrWhiteSpace(jsonMessages))
				messages = JsonConvert.DeserializeObject<MessageList>(jsonMessages);
			
			var newMessage = JsonConvert.DeserializeObject<Message>(jsonMessage);
			newMessage.Id = Guid.NewGuid();
			
			messages.Messages.Add(newMessage);

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

	public class CreateMessageDto
	{
		public string Text { get; set; }
		public bool Active { get; set; }
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