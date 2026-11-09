// 포켓몬 영어 이름 (전국도감 번호)
const EN_BY_NO = {
  1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur', 4: 'Charmander', 5: 'Charmeleon', 6: 'Charizard', 7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise', 10: 'Caterpie',
  11: 'Metapod', 12: 'Butterfree', 13: 'Weedle', 15: 'Beedrill', 16: 'Pidgey', 17: 'Pidgeotto', 18: 'Pidgeot', 19: 'Rattata', 21: 'Spearow', 23: 'Ekans',
  24: 'Arbok', 25: 'Pikachu', 26: 'Raichu', 27: 'Sandshrew', 35: 'Clefairy', 36: 'Clefable', 37: 'Vulpix', 38: 'Ninetales', 39: 'Jigglypuff', 40: 'Wigglytuff',
  41: 'Zubat', 43: 'Oddish', 45: 'Vileplume', 46: 'Paras', 48: 'Venonat', 50: 'Diglett', 51: 'Dugtrio', 52: 'Meowth', 53: 'Persian', 54: 'Psyduck',
  55: 'Golduck', 56: 'Mankey', 58: 'Growlithe', 59: 'Arcanine', 60: 'Poliwag', 63: 'Abra', 64: 'Kadabra', 65: 'Alakazam', 66: 'Machop', 69: 'Bellsprout',
  72: 'Tentacool', 74: 'Geodude', 75: 'Graveler', 77: 'Ponyta', 79: 'Slowpoke', 80: 'Slowbro', 81: 'Magnemite', 83: "Farfetch'd", 84: 'Doduo', 86: 'Seel',
  88: 'Grimer', 90: 'Shellder', 92: 'Gastly', 93: 'Haunter', 94: 'Gengar', 95: 'Onix', 96: 'Drowzee', 98: 'Krabby', 100: 'Voltorb', 102: 'Exeggcute',
  104: 'Cubone', 108: 'Lickitung', 109: 'Koffing', 110: 'Weezing', 111: 'Rhyhorn', 113: 'Chansey', 114: 'Tangela', 115: 'Kangaskhan', 116: 'Horsea', 118: 'Goldeen',
  120: 'Staryu', 121: 'Starmie', 123: 'Scyther', 125: 'Electabuzz', 126: 'Magmar', 127: 'Pinsir', 128: 'Tauros', 129: 'Magikarp', 130: 'Gyarados', 131: 'Lapras',
  132: 'Ditto', 133: 'Eevee', 134: 'Vaporeon', 135: 'Jolteon', 136: 'Flareon', 137: 'Porygon', 142: 'Aerodactyl', 143: 'Snorlax', 144: 'Articuno', 145: 'Zapdos',
  146: 'Moltres', 147: 'Dratini', 148: 'Dragonair', 149: 'Dragonite', 150: 'Mewtwo', 151: 'Mew', 152: 'Chikorita', 155: 'Cyndaquil', 158: 'Totodile', 172: 'Pichu',
  173: 'Cleffa', 175: 'Togepi', 179: 'Mareep', 183: 'Marill', 196: 'Espeon', 197: 'Umbreon', 249: 'Lugia', 250: 'Ho-Oh', 251: 'Celebi', 298: 'Azurill',
  387: 'Turtwig', 390: 'Chimchar', 393: 'Piplup', 417: 'Pachirisu', 447: 'Riolu', 448: 'Lucario', 587: 'Emolga', 650: 'Chespin', 653: 'Fennekin', 656: 'Froakie',
  700: 'Sylveon', 702: 'Dedenne', 722: 'Rowlet', 725: 'Litten', 728: 'Popplio', 778: 'Mimikyu', 906: 'Sprigatito', 909: 'Fuecoco', 912: 'Quaxly', 921: 'Pawmi'
};
const enName = m => EN_BY_NO[m.no] || m.n;
