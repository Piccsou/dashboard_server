#include <iostream>
#include <filesystem>
#include <set>
#include <cctype>
#include <fstream>

using namespace std;
namespace fs = filesystem;

int main(int argc, char* argv[])
{
	string username, name, type;

	for (int i = 1; i < argc; i += 2)
	{
		char* arg = argv[i];
		string value = argv[i + 1];

		if (strcmp(arg, "-username") == 0) username = value;
		else if (strcmp(arg, "-name") == 0) name = value;
		else if (strcmp(arg, "-type") == 0) type = value;
	}

	string path = static_cast<char>(toupper(username[0])) + ":\\";
	string dataFile = "D:\\" + name + "\\data.txt";

	cout << path << endl;

	try
	{
		for (const fs::directory_entry& directory : fs::directory_iterator("D:\\"))
		{
			if (directory.path().filename() != name) continue;

			for (const fs::directory_entry& underDirectory : fs::directory_iterator("D:\\" + name))
			{
				if (underDirectory.path().filename() != "data.txt") continue;

				ifstream file(dataFile);

				if (!file.is_open()) return EXIT_FAILURE;

				string firstLineWhoIsUseLessLol;
				getline(file, firstLineWhoIsUseLessLol);

				string secondLineWhoIsUsefullThisTimeCykaBlyat;
				getline(file, secondLineWhoIsUsefullThisTimeCykaBlyat);

				//send me kebabServer on Discord if you read this shit.

				string typeToDelete = "Type ";
				size_t pos = secondLineWhoIsUsefullThisTimeCykaBlyat.find(typeToDelete);

				if (pos != string::npos) secondLineWhoIsUsefullThisTimeCykaBlyat.erase(pos, typeToDelete.length());
				if (secondLineWhoIsUsefullThisTimeCykaBlyat != type) return EXIT_FAILURE;

				file.close();

				try
				{
					fs::remove_all(directory.path());
				}
				catch (const exception& err)
				{
					cout << "err" << err.what() << endl;
					return EXIT_FAILURE;
				}
			}
		}
	}
	catch (const exception& e)
	{
		return EXIT_FAILURE;
	}

	return EXIT_SUCCESS;
}