using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;

/// <summary>
/// Remove a player from the global PlayersQueue variable.
/// Aguments: userName (string)
/// </summary>
public class CPHInline
{
	public bool Execute()
	{
		if (!CPH.TryGetArg<string>("userName",out string userName) || string.IsNullOrWhiteSpace(userName))
			return true;

		var playersQueue = CPH.GetGlobalVar<string>("PlayersQueue", false);

		if (playersQueue == null || string.IsNullOrWhiteSpace(playersQueue))
			return true;

		var	queueList = JsonConvert.DeserializeObject<QueueList>(playersQueue);

		var player = queueList?.Queue?.FirstOrDefault(x => x.UserName == userName);
		if(player == null)
			return true;

		queueList.Queue.Remove(player);

		var settings = new JsonSerializerSettings
		{
			ContractResolver = new DefaultContractResolver
			{
				NamingStrategy = new CamelCaseNamingStrategy()
			}
		};

		var updatedQueue = JsonConvert.SerializeObject(queueList, settings);
		CPH.SetGlobalVar("PlayersQueue", updatedQueue, false);

		return true;
	}
}

public class QueueRow
{
  public string UserName { get; set; }
  public DateTime QueueTime { get; set; }
}

public class QueueList
{
    public List<QueueRow> Queue { get; set; } = new List<QueueRow>();
}