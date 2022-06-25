import json, re

with open('championFull.json', 'r') as f:
  full_raw_data = json.load(f)
champ_raw_data = full_raw_data["data"]

all_champ_names = []
for i in full_raw_data["keys"].values():
  all_champ_names.append(i)

# {champName1:{Q:{"name": abilityName, "cc":[cctype1, cctype2, ...], "damageTypes":{physicalDamage, magicDamage, ...}}, W:{...}, E:{...}, R:{...}, P:{...}}, champName2:{...}}
ability_binding = {0:"Q", 1:"W", 2:"E", 3:"R"}
damage_search = ["physicalDamage", "magicDamage", "trueDamage"]
data = {}
cc_regex = re.compile("(?:<status>)(.*?)(?:<\/status>)")

for champ in all_champ_names:
  names = {}
  tooltips = {}
  cc_types = {}
  damage_types = {}
  lvl_up = {}


  for index, ability in enumerate(champ_raw_data[champ]["spells"]):
    current_spell = ability_binding[index]
    names[current_spell] = ability["name"]

    tooltips[current_spell] = ability["tooltip"]

    cc_types[current_spell] = cc_regex.findall(ability["tooltip"])

    damage_types[current_spell] = []
    for i in damage_search:
      if i in tooltips[current_spell]:
        damage_types[current_spell].append(i)
    
    lvl_up[current_spell] = []
    if "leveltip" in ability.keys():
      lvl_up[current_spell].append(ability["leveltip"]["label"])
    


  data[champ] = {"Q": {}, "W": {}, "E": {}, "R": {}}
  for i in "QWER":
    data[champ][i]["name"] = names[i]
    data[champ][i]["cc"] = cc_types[i]
    data[champ][i]["damageTypes"] = damage_types[i]
    data[champ][i]["lvlUp"] = lvl_up[i]

    

while True:
  try: 
    search_champ = str(input("Champ Name: "))
    print(data[search_champ])
  except Exception:
    print("Try a different input.")
