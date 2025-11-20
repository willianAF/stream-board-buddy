using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Linq;

/// <summary>
/// Add a player to the global PlayersQueue variable.
/// Aguments: userName (string), externalApp (bool)
/// </summary>
public class CPHInline
{
	public bool Execute()
	{
		CPH.TryGetArg<bool>("externalApp", out var fromExternalApp);

		if (!CPH.TryGetArg<string>("userName",out string userName) || string.IsNullOrWhiteSpace(userName))
			return true;

		var playersQueue = CPH.GetGlobalVar<string>("PlayersQueue", false);

		var queueList = new QueueList();
		if (playersQueue != null && !string.IsNullOrWhiteSpace(playersQueue))
			queueList = JsonConvert.DeserializeObject<QueueList>(playersQueue);

		if(queueList.Queue.Any(x => x.UserName == userName))
		{
			if(!fromExternalApp) CPH.SendMessage("Parece que você já está na fila para jogar. Espere sua vez e bom jogo!!", false);
			return true;
		}

		queueList.Queue.Add(new QueueRow() { UserName = userName, QueueTime = DateTime.Now });

		if(!fromExternalApp)
		{
			CPH.SendMessage("Você foi adicionado a fila com sucesso. Aguarde sua vez e bom jogo!!", false);
		}

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