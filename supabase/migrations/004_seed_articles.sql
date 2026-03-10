-- Migration 004 : Articles de seed pour le blog

insert into public.articles (title, slug, content, excerpt, category, tags, status, published_at)
values (
  'Analyse tactique : le pressing haut de Julien Stéphan',
  'analyse-tactique-pressing-haut-julien-stephan',
  $content1$<h2>Un pressing organisé dès la perte de balle</h2>
<p>Depuis son retour sur le banc rennais en décembre 2021, Julien Stéphan a progressivement installé une identité de jeu reconnaissable. Le Stade Rennais de cette ère est avant tout une équipe qui défend haut, presse avec intensité et tente de récupérer le ballon dans le camp adverse.</p>
<p>Ce pressing n'est pas désorganisé. Il repose sur des déclencheurs précis : une passe en retrait du gardien, un contrôle raté ou une passe vers un latéral. Ces signaux déclenchent une pression coordonnée de l'ensemble du bloc rennais, qui remonte de dix à quinze mètres en quelques secondes.</p>
<h2>Le rôle clé des milieux dans l'animation</h2>
<p>L'organisation en 4-3-3 ou en 4-2-3-1 selon les adversaires place les milieux au cœur du dispositif. Le milieu relayeur — souvent Benjamin Bourigeaud ou Désiré Doué — est chargé d'orienter le pressing vers le côté faible. L'objectif est de canaliser l'adversaire plutôt que de le presser sur toute la largeur.</p>
<p>Cette organisation exige une grande dépense physique, ce qui explique les rotations régulières opérées par le coach breton sur ce secteur du terrain. La fraîcheur en deuxième période est un enjeu majeur pour maintenir l'intensité du pressing.</p>
<h2>Les limites du système</h2>
<p>Comme tout système, le pressing haut a ses failles. Face à des équipes capables de jouer vite derrière la ligne de pression, les espaces dans le dos de la défense rennaise sont parfois larges. C'est notamment ce qu'ont exploité certains adversaires en Ligue 1 et en Ligue Europa Conférence.</p>
<p>Le Stade Rennais doit donc constamment ajuster son bloc en fonction du profil de l'adversaire, alternant entre pressing haut agressif et un bloc médian plus prudent lorsque la situation l'impose.</p>
<h2>Conclusion</h2>
<p>Le pressing haut rennais est l'une des identités tactiques les plus marquées de la Ligue 1. Un choix assumé, cohérent avec le profil des joueurs recrutés et avec l'ambition d'un club qui veut peser dans le haut du tableau.</p>$content1$,
  'Depuis son retour sur le banc rennais, Julien Stéphan a installé un pressing haut organisé comme signature tactique. Décryptage d''un système exigeant.',
  'Tactique',
  ARRAY['tactique', 'stephan', 'pressing', 'analyse'],
  'published',
  now() - interval '6 days'
);

insert into public.articles (title, slug, content, excerpt, category, tags, status, published_at)
values (
  'Désiré Doué, le joyau breton : retour sur une trajectoire hors norme',
  'desire-doue-joyau-breton-trajectoire',
  $content2$<h2>Une formation 100 % rennaise</h2>
<p>Désiré Doué est l'archétype du joueur formé à l'Académie du Stade Rennais. Entré au centre de formation à l'âge de onze ans, il a gravi toutes les étapes du football de formation breton avant d'exploser en équipe première. Son parcours est un modèle que le club aime à mettre en avant, preuve de la qualité du travail effectué depuis les catégories jeunes.</p>
<p>Né en 2005 à Angers, Doué a rapidement été repéré pour sa capacité à éliminer balle au pied et sa vision du jeu. À seize ans, il effectuait ses premiers pas en professionnel, signant des prestations qui ont immédiatement retenu l'attention des observateurs.</p>
<h2>La saison de la révélation</h2>
<p>C'est lors de la saison 2022-2023 que Doué a vraiment éclaté aux yeux du grand public. Titularisé régulièrement par Julien Stéphan, le milieu offensif a démontré une maturité technique et tactique rare pour son âge. Sa capacité à évoluer dans des espaces réduits, à combiner avec ses partenaires et à prendre des décisions rapides en a fait l'un des joueurs les plus excitants du championnat.</p>
<p>Sa polyvalence est également un atout précieux : capable de jouer en ailier gauche, en numéro 10 ou en milieu relayeur, il donne des options tactiques supplémentaires à son entraîneur.</p>
<h2>Le départ vers Paris</h2>
<p>Son transfert au Paris Saint-Germain à l'été 2024 a marqué les supporters rennais. Un départ attendu au vu de sa progression, mais douloureux pour un club qui avait tant investi dans son développement. Le montant du transfert, estimé à environ 50 millions d'euros, représente une manne financière importante pour le Stade Rennais.</p>
<p>Doué reste l'exemple parfait de ce que le club peut produire : un talent formé localement, vendu au plus haut niveau, et dont le parcours inspire la génération suivante de jeunes Bretons qui rêvent de Ligue 1.</p>$content2$,
  'Formé à Rennes, révélé en Ligue 1, transféré au PSG : retour sur la trajectoire exceptionnelle de Désiré Doué, pur produit du centre de formation rennais.',
  'Joueurs',
  ARRAY['doue', 'formation', 'psg', 'transfert'],
  'published',
  now() - interval '12 days'
);

insert into public.articles (title, slug, content, excerpt, category, tags, status, published_at)
values (
  'Roazhon Park : l''histoire d''une enceinte qui a grandi avec son club',
  'roazhon-park-histoire-stade-rennais',
  $content3$<h2>Des origines modestes au stade moderne</h2>
<p>Le Roazhon Park — anciennement Route de Lorient — est bien plus qu'une infrastructure sportive pour les Rennais. C'est un lieu de mémoire, un espace où plusieurs générations de supporters ont vécu les joies et les peines d'un club en constante évolution.</p>
<p>Inauguré en 1912, le stade a traversé de profondes transformations au fil des décennies. De l'enceinte à l'ancienne des débuts aux rénovations successives, le Roazhon Park d'aujourd'hui peut accueillir plus de 29 000 spectateurs dans des conditions modernes, ce qui en fait l'un des stades de Ligue 1 parmi les mieux équipés de province.</p>
<h2>Le virage nord, cœur battant du stade</h2>
<p>Si le Roazhon Park a une âme, elle se trouve dans le Virage Nord. C'est là que se regroupent les ultras rennais, les groupes de supporters les plus actifs, ceux qui animent les matchs de leur voix et de leurs tifos. Les Roazhon Celtic Kop, fondés en 1994, sont les principaux animateurs de cette tribune.</p>
<p>L'atmosphère générée par ce virage lors des grandes soirées européennes ou des derbies est souvent citée comme l'une des plus chaleureuses de France. Un atout non négligeable pour les joueurs rennais, qui reconnaissent volontiers l'impact du public sur leurs performances.</p>
<h2>Un outil au service des ambitions</h2>
<p>Avec les projets d'agrandissement évoqués régulièrement par la direction, le Roazhon Park pourrait encore évoluer dans les prochaines années. L'objectif : se doter d'une enceinte à la hauteur des ambitions européennes du club, capable d'accueillir des matchs d'envergure dans des conditions optimales.</p>
<p>Pour l'heure, le stade reste le symbole d'une ville et d'un club qui ont grandi ensemble, portés par une passion commune pour le football et les couleurs rouge et noir.</p>$content3$,
  'Du terrain des débuts au stade moderne de 29 000 places, le Roazhon Park raconte l''histoire d''un club et d''une ville. Retour sur une enceinte chargée d''histoire.',
  'Culture',
  ARRAY['roazhon park', 'stade', 'histoire', 'supporters'],
  'published',
  now() - interval '18 days'
);

insert into public.articles (title, slug, content, excerpt, category, tags, status, published_at)
values (
  'Mercato rennais : comment le Stade Rennais construit son effectif',
  'mercato-rennais-construction-effectif',
  $content4$<h2>Une philosophie de recrutement affirmée</h2>
<p>Depuis l'arrivée de Florian Maurice au poste de directeur sportif en 2019, le Stade Rennais a affiné sa politique de recrutement. La philosophie est claire : miser sur des joueurs jeunes à fort potentiel, les développer au sein du club, puis les revendre avec une plus-value conséquente si une opportunité se présente.</p>
<p>Des dossiers comme Camavinga (vendu au Real Madrid pour 40 M€), Traoré ou plus récemment Doué illustrent parfaitement cette stratégie. Le Stade Rennais ne peut pas rivaliser financièrement avec les grands clubs européens, mais il peut se positionner comme un tremplin de choix pour les talents émergents.</p>
<h2>Le rôle central de la cellule de recrutement</h2>
<p>La cellule de recrutement rennaise est reconnue pour sa capacité à dénicher des profils dans des championnats moins exposés. Scandinavie, Amérique du Sud, Afrique subsaharienne : les scouts du club ratissent large pour trouver des talents à prix raisonnable. Cette approche permet de limiter les dépenses sur les transferts entrants tout en maintenant un niveau de compétitivité élevé.</p>
<p>L'intégration des données statistiques dans le processus de détection est également un axe de travail important. Le club investit dans des outils d'analyse pour affiner ses critères de sélection et réduire les risques de recrutement raté.</p>
<h2>Le centre de formation, premier vivier</h2>
<p>Parallèlement aux recrutements externes, le centre de formation reste le premier réservoir du club. Classé parmi les meilleurs de France, il produit régulièrement des joueurs capables d'intégrer l'effectif professionnel.</p>
<p>La recette semble fonctionner : depuis cinq ans, le Stade Rennais est régulièrement qualifié pour les compétitions européennes, signe que la stratégie globale porte ses fruits au-delà du seul aspect financier.</p>$content4$,
  'Recrutement de jeunes talents, valorisation via la revente, centre de formation d''excellence : décryptage de la politique mercato qui a fait du Stade Rennais un modèle en Ligue 1.',
  'Mercato',
  ARRAY['mercato', 'recrutement', 'formation', 'strategie'],
  'published',
  now() - interval '25 days'
);

insert into public.articles (title, slug, content, excerpt, category, tags, status, published_at)
values (
  'Stade Rennais en Coupe d''Europe : bilan d''une aventure continentale',
  'stade-rennais-coupe-europe-bilan',
  $content5$<h2>Le retour sur la scène européenne</h2>
<p>Pendant longtemps, le Stade Rennais était synonyme de club solide en Ligue 1 mais absent des compétitions européennes. La qualification pour la Ligue Europa en 2020-2021 a marqué un tournant. Pour la première fois depuis des décennies, les supporters rennais ont pu vivre des soirées européennes au Roazhon Park.</p>
<p>La Ligue Europa Conférence est ensuite devenue le terrain de jeu régulier du club. Une compétition qui offre une expérience européenne précieuse pour les joueurs et le staff, et qui permet de mesurer le niveau du club face à des adversaires variés.</p>
<h2>Les grandes soirées à retenir</h2>
<p>Parmi les moments marquants, la campagne de Ligue Europa 2022-2023 reste dans les mémoires. Tombés dans un groupe relevé, les Rennais ont su faire face, produisant des performances convaincantes face à des adversaires expérimentés. La qualification pour la phase à élimination directe a été vécue comme un accomplissement collectif.</p>
<p>Ces matchs européens ont également mis en lumière la capacité du Roazhon Park à créer une atmosphère électrique lors des grandes occasions. Les tifos du Virage Nord, la sono du stade, les chants des supporters : tout converge pour créer un environnement propice à la performance.</p>
<h2>Les leçons tirées</h2>
<p>L'Europe a également été une école pour le club. Gérer le calendrier chargé entre Ligue 1 et compétitions continentales, adapter le style de jeu à des adversaires moins connus, maintenir la fraîcheur physique sur la durée : autant de défis qui ont fait grandir le groupe et le staff technique.</p>
<p>L'objectif désormais affiché est de s'installer durablement sur la scène européenne, et pourquoi pas, de franchir un cap supplémentaire en visant la Ligue Europa, voire la Ligue des Champions à terme.</p>$content5$,
  'De la Ligue Europa à la Conférence League, le Stade Rennais a écrit de belles pages européennes ces dernières saisons. Bilan et perspectives d''un club qui grandit.',
  'Europe',
  ARRAY['europe', 'ligue europa', 'conference league', 'bilan'],
  'published',
  now() - interval '32 days'
);
