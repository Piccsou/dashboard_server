#include <iostream>
#include <cstdlib>
#include <cstring>
#include <optional>
#include <unordered_map>
#include <Windows.h>
#include <codecvt>
#include <locale>
#include <fstream>
#include <chrono>

using namespace std;

#pragma region validTypes
enum class ValidTypes
{
	Gmod,
	Minecraft,
	CS,
	DiscordBot,
	Stockage,
	Unturned
};

unordered_map<string, ValidTypes> typeMap = {
	{ "gmod", ValidTypes::Gmod },
	{ "minecraft", ValidTypes::Minecraft },
	{ "cs", ValidTypes::CS },
	{ "discordbot", ValidTypes::DiscordBot },
	{ "stockage", ValidTypes::Stockage },
	{ "unturned", ValidTypes::Unturned }
};

struct ValidTypesConverter {
	static string ToString(ValidTypes val)
	{
		switch (val)
		{
		case ValidTypes::Gmod: return "gmod";
		case ValidTypes::Minecraft: "minecraft";
		case ValidTypes::CS: "cs";
		case ValidTypes::DiscordBot: "discordbot";
		case ValidTypes::Stockage: "stockage";
		case ValidTypes::Unturned: return "unturned";
		default: return "unknown";
		}
	}
};
#pragma endregion

int main(int argc, char* argv[])
{
	if (argc % 2 != 1)
	{
		cout << "err" << endl;
		return EXIT_FAILURE;
	}

	string username;
	string name;
	ValidTypes type;
	optional<string> version;

	for (int i = 1; i < argc; i += 2)
	{
		char* arg = argv[i];
		string value = argv[i + 1];

		if (strcmp(arg, "-username") == 0) username = value;
		else if (strcmp(arg, "-name") == 0) name = value;
		else if (strcmp(arg, "-type") == 0)
		{
			switch (typeMap[arg])
			{
			case ValidTypes::Gmod: type = ValidTypes::Gmod; break;
			case ValidTypes::Minecraft: type = ValidTypes::Minecraft; break;
			case ValidTypes::CS: type = ValidTypes::CS; break;
			case ValidTypes::DiscordBot: type = ValidTypes::DiscordBot; break;
			case ValidTypes::Stockage: type = ValidTypes::Stockage; break;
			case ValidTypes::Unturned: type = ValidTypes::Unturned; break;
			default: return EXIT_FAILURE; break;
			}
		}
		else if (strcmp(arg, "-version") == 0)
		{
			version = value;
		}
	}

	if (ValidTypes::Minecraft == type || ValidTypes::DiscordBot == type && !version.has_value()) return EXIT_FAILURE;

	char buffer[100];
	DWORD drives = GetLogicalDriveStringsA(sizeof(buffer), buffer);
	string u = string(1, username[0]);
	wstring d = wstring(u.begin(), u.end()) + L":\\";
	const wchar_t* dl = d.c_str();

	if (drives > 0 && drives <= sizeof(buffer))
	{
		UINT driveType = GetDriveType(dl);
		if (driveType != DRIVE_FIXED) return EXIT_FAILURE;

		int l = MultiByteToWideChar(CP_UTF8, 0, name.c_str(), name.size(), nullptr, 0);
		if (l > 0)
		{
			wstring n(l, L'\0');
			MultiByteToWideChar(CP_UTF8, 0, name.c_str(), name.size(), &n[0], name.length());

			wstring path = dl + n;

			if (CreateDirectory(path.c_str(), NULL) || ERROR_ALREADY_EXISTS == GetLastError())
			{
				wstring filePath = path + L"\\data.txt";

				wcout << filePath;
				ofstream dataFile(filePath);

				if (dataFile.is_open())
				{
					dataFile << "Author " << username << endl;
					dataFile << "Type " << ValidTypesConverter::ToString(type) << endl;
					dataFile << "Nom " << name << endl;
					dataFile << "Creation " << chrono::duration_cast<chrono::milliseconds>(chrono::system_clock::now().time_since_epoch()).count() << endl;

					dataFile.close();
				}
				else
				{
					return EXIT_FAILURE;
				}

				if (ValidTypes::Minecraft == type)
				{
					//appeler .exe
				}
			}
			else
			{
				return EXIT_FAILURE;
			}
		}
		else return EXIT_FAILURE;
	}
	else return EXIT_FAILURE;

	return EXIT_SUCCESS;
}