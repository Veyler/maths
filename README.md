# Maths App Démo

Cette application est en cours de développement.

---

### Comment tester la démo ?

La démo est divisé en 3 parties :
- Élève
- Profile
- Prof
La première partie est la zone groupant tout les exercices. La seconde permet a l'élève de suivre sa progression sur les différents exercices. Et la troisième qui, a terme, sera séparée des deux autres, uniquement accessible via un compte admin détenu par le professeur. Ici pour des raisons de simplicité, j'ai réunis les 3.
Pour tester la démo, un exercice simple est déjà présent dans la section élève. Il suffit de cliquer dessus pour le résoudre. Une fois cela fait, la progression de cette exercice sur la page profile devrait apparaitre. Pour rajouter un nouvelle exercice, il suffit de modifier le json dans la section prof, et de cliquer sur ajouter. L'exercice apparait alors sur la page élève, et profile.

### Pourquoi le json pour les exercices ?

A terme, le json est nécessaire pour gérer une grande quantité d'exercices. De plus, bien que plus embêtant qu'autre chose dans cette démo, lorsqu'il faudra ajouter beaucoup d'exercice d'un coup, il suffira de demander à l'IA de réécrire les exercices en json, pour les copier coller directement dans un dossier exercices du projets.

### Évolution possible :

- Le plus urgent : Créer un système de compte, gérer par un compte admin (qui pourra alors gérer différents élève / classes) depuis une interface.
- Ajouter une section cours
- Permettre à l'admin de drag and drop des fichiers json directement dans l'interface pour rajouter des exercices / cours.
- Sauvegarder les progressions des élèves dans une BDD

### Stack technique conseillé pour y parvenir :

Je pense que le plus adapté est d'utiliser pour le backend, node js + express qui communiquerais avec une BDD SQLite3 (pas besoin de gros pour ce genre de projet). Il faut faire attention au serveur sur lequel ce backend tournera soit assez performant pour accueillir un nombre d’élève important.  
 
