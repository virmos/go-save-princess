from csv import reader

def print_csv_layout(path):
  terrain_map = []
  with open(path) as level_map:
    layout = reader(level_map, delimiter=',')
    for row in layout:
      terrain_map.append(list(row))
    print(terrain_map)

if __name__ == '__main__':
  print_csv_layout('map_Entities.csv')