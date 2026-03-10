-- Migration 005 : Ajout des images de couverture aux articles

update public.articles
set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Lens_-_Stade_Rennais_%2820-08-2023%29_19.jpg/1280px-Lens_-_Stade_Rennais_%2820-08-2023%29_19.jpg'
where slug = 'analyse-tactique-pressing-haut-julien-stephan';

update public.articles
set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/FC_Salzburg_gegen_Paris_Saint-Germain_UEFA_Champions_League_84.jpg/1280px-FC_Salzburg_gegen_Paris_Saint-Germain_UEFA_Champions_League_84.jpg'
where slug = 'desire-doue-joyau-breton-trajectoire';

update public.articles
set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Roazhon_Park_ext%C3%A9rieur.JPG/1280px-Roazhon_Park_ext%C3%A9rieur.JPG'
where slug = 'roazhon-park-histoire-stade-rennais';

update public.articles
set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Staderennais-routelorient.JPG/1280px-Staderennais-routelorient.JPG'
where slug = 'mercato-rennais-construction-effectif';

update public.articles
set cover_image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Stade_Route_de_Lorient_3.JPG/1280px-Stade_Route_de_Lorient_3.JPG'
where slug = 'stade-rennais-coupe-europe-bilan';
