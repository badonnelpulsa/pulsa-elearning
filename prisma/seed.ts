import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de données...");
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log("Création des utilisateurs...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Pulsa",
      email: "admin@pulsa.fr",
      password: adminPassword,
      role: "admin",
    },
  });

  const learner = await prisma.user.create({
    data: {
      name: "Jean Dupont",
      email: "jean@exemple.fr",
      password: userPassword,
      role: "learner",
    },
  });

  console.log("Création des badges...");

  await prisma.badge.createMany({
    data: [
      {
        name: "Premier pas",
        description: "Terminez votre première leçon",
        icon: "🎯",
        condition: "first_lesson",
      },
      {
        name: "Curieux",
        description: "Commencez 3 parcours différents",
        icon: "🔍",
        condition: "start_3_courses",
      },
      {
        name: "Expert Quiz",
        description: "Obtenez 100% à un quiz",
        icon: "🏆",
        condition: "perfect_quiz",
      },
      {
        name: "Assidu",
        description: "Terminez un parcours complet",
        icon: "⭐",
        condition: "complete_course",
      },
      {
        name: "Maître IA",
        description: "Terminez tous les parcours disponibles",
        icon: "🤖",
        condition: "complete_all_courses",
      },
    ],
  });

  console.log("Création du parcours 1 : Introduction à l'IA Générative...");

  const course1 = await prisma.course.create({
    data: {
      title: "Introduction à l'IA Générative",
      slug: "introduction-ia-generative",
      description:
        "Découvrez les fondamentaux de l'intelligence artificielle générative : des réseaux de neurones aux modèles de langage, en passant par les applications concrètes dans l'industrie.",
      category: "IA Générative",
      difficulty: "beginner",
      duration: "8 heures",
      published: true,
      modules: {
        create: [
          {
            title: "Qu'est-ce que l'IA Générative ?",
            description:
              "Comprendre les bases de l'intelligence artificielle générative et son évolution.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Définition et concepts fondamentaux",
                  order: 1,
                  type: "text",
                  content: `L'intelligence artificielle générative (IA générative) désigne une catégorie de systèmes d'IA capables de créer du contenu nouveau et original : texte, images, audio, vidéo, code informatique, et bien plus encore.

Contrairement à l'IA discriminative qui se contente de classer ou analyser des données existantes, l'IA générative apprend les patterns sous-jacents d'un ensemble de données d'entraînement pour produire de nouvelles instances similaires mais originales.

Les fondements théoriques reposent sur plusieurs concepts clés :
- Les réseaux de neurones artificiels, inspirés du fonctionnement du cerveau humain
- L'apprentissage profond (deep learning), qui utilise des architectures en couches multiples
- Les modèles probabilistes, qui permettent de générer des sorties variées et créatives

L'IA générative s'appuie sur des architectures spécifiques comme les Transformers (introduits par Google en 2017), les GAN (Generative Adversarial Networks) et les modèles de diffusion. Ces architectures ont permis des avancées spectaculaires ces dernières années.

Les applications sont vastes : rédaction automatique, génération d'images, assistance au codage, synthèse vocale, création musicale, conception de médicaments, et bien d'autres domaines en constante expansion.`,
                  quiz: {
                    create: {
                      title: "Quiz : Les bases de l'IA Générative",
                      questions: {
                        create: [
                          {
                            text: "Quelle est la principale différence entre l'IA générative et l'IA discriminative ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "L'IA générative crée du contenu nouveau, tandis que l'IA discriminative classe ou analyse des données existantes.",
                            options: {
                              create: [
                                {
                                  text: "L'IA générative crée du contenu nouveau, l'IA discriminative classe des données",
                                  isCorrect: true,
                                },
                                {
                                  text: "L'IA générative est plus rapide que l'IA discriminative",
                                  isCorrect: false,
                                },
                                {
                                  text: "L'IA discriminative utilise des réseaux de neurones, pas l'IA générative",
                                  isCorrect: false,
                                },
                                {
                                  text: "Il n'y a aucune différence significative",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                          {
                            text: "Quelle architecture, introduite par Google en 2017, est à la base des modèles de langage modernes ?",
                            type: "single",
                            order: 2,
                            explanation:
                              "L'architecture Transformer, présentée dans l'article 'Attention is All You Need', est la base des modèles comme GPT et BERT.",
                            options: {
                              create: [
                                {
                                  text: "Transformer",
                                  isCorrect: true,
                                },
                                {
                                  text: "CNN (Convolutional Neural Network)",
                                  isCorrect: false,
                                },
                                {
                                  text: "RNN (Recurrent Neural Network)",
                                  isCorrect: false,
                                },
                                {
                                  text: "Perceptron multicouche",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  title: "Histoire et évolution de l'IA Générative",
                  order: 2,
                  type: "text",
                  content: `L'histoire de l'IA générative s'étend sur plusieurs décennies, avec une accélération spectaculaire ces dernières années.

Les années 1950-1990 : Les prémices
Les premiers travaux sur les réseaux de neurones remontent aux années 1950 avec le Perceptron de Frank Rosenblatt. Les réseaux de Hopfield (1982) et les machines de Boltzmann ont posé les bases des modèles génératifs.

Les années 2010 : La révolution du deep learning
L'avènement du deep learning a transformé le domaine. En 2014, Ian Goodfellow introduit les GAN (Generative Adversarial Networks), une architecture où deux réseaux s'affrontent : un générateur qui crée du contenu et un discriminateur qui tente de le détecter.

2017 : L'architecture Transformer
Google publie "Attention is All You Need", un article fondateur qui introduit l'architecture Transformer. Ce mécanisme d'attention permet de traiter des séquences de manière parallèle, rendant l'entraînement beaucoup plus efficace.

2018-2020 : GPT et BERT
OpenAI lance GPT (2018) puis GPT-2 (2019) et GPT-3 (2020). Ces modèles de langage de grande taille démontrent des capacités impressionnantes de génération de texte. Parallèlement, DALL-E repousse les limites de la génération d'images.

2022-2024 : L'explosion grand public
ChatGPT (novembre 2022) marque un tournant majeur en rendant l'IA générative accessible au grand public. Suivent Claude d'Anthropic, Gemini de Google, Midjourney, Stable Diffusion et de nombreux autres outils.

Aujourd'hui, l'IA générative est un domaine en pleine effervescence avec des avancées quasi quotidiennes, transformant profondément de nombreux secteurs industriels.`,
                },
                {
                  title: "Les principaux types de modèles génératifs",
                  order: 3,
                  type: "text",
                  content: `Il existe plusieurs grandes familles de modèles génératifs, chacune avec ses forces et ses applications privilégiées.

1. Les modèles de langage (LLM - Large Language Models)
Ce sont des modèles entraînés sur d'immenses corpus de texte. Ils prédisent le prochain token (mot ou sous-mot) dans une séquence. Exemples : GPT-4, Claude, Gemini, Llama.
Applications : rédaction, résumé, traduction, code, analyse de données.

2. Les GAN (Generative Adversarial Networks)
Deux réseaux de neurones s'affrontent : le générateur crée des données, et le discriminateur évalue leur authenticité. Par cette compétition, le générateur s'améliore progressivement.
Applications : génération de visages, super-résolution d'images, transfert de style.

3. Les modèles de diffusion
Ces modèles apprennent à inverser un processus de dégradation progressive (ajout de bruit) pour générer des données à partir du bruit aléatoire. Ils produisent des résultats de très haute qualité.
Applications : DALL-E, Stable Diffusion, Midjourney pour la génération d'images.

4. Les VAE (Variational Autoencoders)
Ces modèles encodent des données dans un espace latent compressé, puis décodent de nouveaux échantillons à partir de points de cet espace.
Applications : génération de molécules, compression de données, augmentation de données.

5. Les modèles multimodaux
Ces modèles combinent plusieurs modalités (texte, image, audio) et peuvent transformer une modalité en une autre.
Applications : GPT-4 Vision, description d'images, génération d'images à partir de texte.

Le choix du modèle dépend de l'application visée, des ressources disponibles et du compromis qualité/rapidité souhaité.`,
                  quiz: {
                    create: {
                      title: "Quiz : Les types de modèles génératifs",
                      questions: {
                        create: [
                          {
                            text: "Quel type de modèle utilise deux réseaux en compétition (générateur et discriminateur) ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "Les GAN utilisent un générateur et un discriminateur qui s'affrontent pour améliorer la qualité de génération.",
                            options: {
                              create: [
                                {
                                  text: "GAN (Generative Adversarial Networks)",
                                  isCorrect: true,
                                },
                                {
                                  text: "VAE (Variational Autoencoders)",
                                  isCorrect: false,
                                },
                                {
                                  text: "Modèles de diffusion",
                                  isCorrect: false,
                                },
                                {
                                  text: "Transformers",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                          {
                            text: "Quel type de modèle est utilisé par DALL-E et Stable Diffusion ?",
                            type: "single",
                            order: 2,
                            explanation:
                              "DALL-E et Stable Diffusion utilisent des modèles de diffusion qui inversent un processus d'ajout de bruit pour générer des images.",
                            options: {
                              create: [
                                {
                                  text: "Modèles de diffusion",
                                  isCorrect: true,
                                },
                                {
                                  text: "GAN",
                                  isCorrect: false,
                                },
                                {
                                  text: "VAE",
                                  isCorrect: false,
                                },
                                {
                                  text: "RNN",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            title: "Les modèles de langage (LLM)",
            description:
              "Plongez dans le fonctionnement des grands modèles de langage qui révolutionnent l'industrie.",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Comment fonctionne un LLM ?",
                  order: 1,
                  type: "text",
                  content: `Les grands modèles de langage (Large Language Models ou LLM) sont au cœur de la révolution actuelle de l'IA générative. Comprendre leur fonctionnement est essentiel.

Le principe de base : la prédiction du prochain token
Un LLM est fondamentalement un système de prédiction statistique. Il prend en entrée une séquence de tokens (mots ou sous-mots) et prédit le token le plus probable qui devrait suivre. En répétant ce processus, il génère du texte cohérent.

L'architecture Transformer en détail
Le Transformer utilise un mécanisme appelé "attention" qui permet au modèle de considérer simultanément toutes les parties d'un texte pour comprendre les relations entre les mots, même éloignés.

Les composants clés :
- L'embedding : conversion des tokens en vecteurs numériques
- Le mécanisme d'attention multi-têtes : analyse des relations entre les tokens
- Les couches feed-forward : transformation des représentations
- La normalisation : stabilisation de l'entraînement

L'entraînement se fait en deux phases principales :
1. Le pré-entraînement : le modèle apprend sur des téraoctets de texte à prédire le prochain mot. C'est la phase la plus coûteuse en calcul.
2. Le fine-tuning / RLHF : le modèle est affiné pour suivre des instructions et produire des réponses utiles et sûres.

La taille compte : les LLM modernes contiennent de dizaines de milliards à des centaines de milliards de paramètres, ce qui leur confère des capacités émergentes surprenantes comme le raisonnement en chaîne.`,
                },
                {
                  title: "Le prompt engineering",
                  order: 2,
                  type: "text",
                  content: `Le prompt engineering est l'art de formuler des instructions efficaces pour obtenir les meilleurs résultats d'un modèle de langage. C'est une compétence essentielle pour exploiter pleinement l'IA générative.

Les principes fondamentaux du prompt engineering :

1. La clarté et la spécificité
Plus votre instruction est précise, meilleur sera le résultat. Au lieu de "Écris un email", préférez "Rédige un email professionnel de 150 mots à un client pour l'informer d'un retard de livraison de 2 jours, avec un ton empathique."

2. Le contexte
Fournissez le contexte nécessaire : votre rôle, votre audience, le format attendu, les contraintes. Exemple : "Tu es un expert en marketing digital. Rédige 5 idées de posts LinkedIn pour une PME industrielle qui adopte l'IA."

3. Les exemples (few-shot learning)
Montrez au modèle ce que vous attendez en donnant des exemples de paires entrée/sortie. C'est particulièrement efficace pour des tâches spécifiques.

4. La décomposition (chain-of-thought)
Pour les tâches complexes, demandez au modèle de raisonner étape par étape. "Réfléchis étape par étape avant de donner ta réponse finale."

5. Le formatage
Spécifiez le format de sortie : JSON, tableau, liste à puces, Markdown, etc. Cela facilite l'intégration dans vos workflows.

Techniques avancées :
- Zero-shot : pas d'exemple, juste une instruction claire
- Few-shot : quelques exemples avant la question
- Chain-of-thought : raisonnement explicite étape par étape
- Role playing : attribuer un rôle spécifique au modèle
- Self-consistency : générer plusieurs réponses et choisir la meilleure

Le prompt engineering est un domaine en rapide évolution. La meilleure approche est d'expérimenter, d'itérer et de documenter ce qui fonctionne pour vos cas d'usage spécifiques.`,
                  quiz: {
                    create: {
                      title: "Quiz : Le prompt engineering",
                      questions: {
                        create: [
                          {
                            text: "Quelle technique consiste à donner quelques exemples au modèle avant de poser la question ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "Le few-shot learning consiste à fournir quelques exemples au modèle pour qu'il comprenne le format et le type de réponse attendu.",
                            options: {
                              create: [
                                {
                                  text: "Few-shot learning",
                                  isCorrect: true,
                                },
                                {
                                  text: "Zero-shot learning",
                                  isCorrect: false,
                                },
                                {
                                  text: "Transfer learning",
                                  isCorrect: false,
                                },
                                {
                                  text: "Reinforcement learning",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                          {
                            text: "Quelle technique demande au modèle de raisonner étape par étape ?",
                            type: "single",
                            order: 2,
                            explanation:
                              "Le Chain-of-Thought (CoT) pousse le modèle à expliciter son raisonnement étape par étape, améliorant la qualité des réponses complexes.",
                            options: {
                              create: [
                                {
                                  text: "Chain-of-thought",
                                  isCorrect: true,
                                },
                                {
                                  text: "Few-shot learning",
                                  isCorrect: false,
                                },
                                {
                                  text: "Role playing",
                                  isCorrect: false,
                                },
                                {
                                  text: "Self-consistency",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  title: "Les API et l'intégration dans vos applications",
                  order: 3,
                  type: "text",
                  content: `L'un des atouts majeurs des LLM modernes est leur accessibilité via des API (Application Programming Interface). Cela permet d'intégrer l'IA générative directement dans vos applications et workflows.

Les principaux fournisseurs d'API :
- OpenAI (GPT-4, GPT-4o) : l'un des plus populaires
- Anthropic (Claude) : reconnu pour sa sûreté et ses capacités de raisonnement
- Google (Gemini) : intégré à l'écosystème Google Cloud
- Meta (Llama) : modèles open-source
- Mistral AI : entreprise française avec des modèles performants

Comment intégrer une API LLM :

1. Authentification
Chaque fournisseur fournit une clé API. Cette clé doit être stockée de manière sécurisée (variables d'environnement, secrets manager).

2. Envoi de requêtes
La plupart des API acceptent des requêtes HTTP POST avec un corps JSON contenant le prompt, les paramètres (température, longueur maximale) et le modèle choisi.

3. Paramètres importants
- Température (0-1) : contrôle la créativité. 0 = déterministe, 1 = très créatif
- Max tokens : limite la longueur de la réponse
- Top-p : contrôle la diversité des réponses
- Stop sequences : mots ou séquences qui arrêtent la génération

4. Gestion des coûts
Les API sont facturées par token (entrée + sortie). Il est crucial de :
- Optimiser vos prompts pour réduire le nombre de tokens
- Mettre en cache les réponses fréquentes
- Surveiller votre consommation
- Choisir le modèle approprié (pas toujours besoin du plus gros)

5. Bonnes pratiques
- Gérer les erreurs et les limites de taux (rate limiting)
- Implémenter des mécanismes de retry avec backoff exponentiel
- Valider les sorties du modèle avant de les utiliser
- Mettre en place des garde-fous (guardrails) pour la sécurité`,
                },
              ],
            },
          },
          {
            title: "Applications industrielles de l'IA Générative",
            description:
              "Explorez les cas d'usage concrets de l'IA générative dans différents secteurs industriels.",
            order: 3,
            lessons: {
              create: [
                {
                  title: "L'IA Générative dans la production industrielle",
                  order: 1,
                  type: "text",
                  content: `L'IA générative transforme profondément les processus de production industrielle. Voici les principaux cas d'usage.

Conception et design assistés par IA
Les outils de design génératif permettent aux ingénieurs de spécifier des contraintes (poids, résistance, matériaux, coût) et de laisser l'IA explorer des milliers de solutions optimales. Autodesk, Siemens et Dassault Systèmes intègrent ces capacités dans leurs logiciels.

Maintenance prédictive augmentée
Les LLM peuvent analyser les données des capteurs IoT, les rapports de maintenance passés et la documentation technique pour :
- Prédire les pannes avant qu'elles ne surviennent
- Générer automatiquement des rapports de diagnostic
- Proposer des procédures de réparation adaptées
- Optimiser la planification de la maintenance

Optimisation de la supply chain
L'IA générative aide à :
- Simuler des scénarios de disruption et proposer des plans de contingence
- Générer des prévisions de demande plus précises
- Rédiger automatiquement des appels d'offres et des contrats
- Optimiser les itinéraires logistiques

Contrôle qualité
Les modèles de vision par ordinateur génératifs améliorent la détection de défauts :
- Génération de données synthétiques pour l'entraînement (défauts rares)
- Classification automatique des défauts
- Génération de rapports d'inspection détaillés

Documentation technique
L'IA générative accélère considérablement la création de documentation :
- Manuels d'utilisation
- Procédures opérationnelles standard (SOP)
- Fiches de données de sécurité
- Traduction multilingue de la documentation`,
                },
                {
                  title: "L'IA Générative dans les services et le commerce",
                  order: 2,
                  type: "text",
                  content: `Au-delà de l'industrie manufacturière, l'IA générative révolutionne les secteurs des services et du commerce.

Service client et chatbots
Les chatbots alimentés par des LLM offrent une expérience client transformée :
- Réponses naturelles et contextuelles 24h/24
- Compréhension des requêtes complexes et ambiguës
- Escalade intelligente vers des agents humains
- Analyse des sentiments en temps réel
- Personnalisation des réponses selon l'historique client

Marketing et communication
L'IA générative permet de :
- Créer du contenu marketing personnalisé à grande échelle
- Générer des variantes de publicités pour l'A/B testing
- Rédiger des newsletters et articles de blog optimisés SEO
- Créer des visuels de produits sans séance photo
- Personnaliser l'expérience utilisateur en temps réel

Ressources humaines
Les applications RH de l'IA générative incluent :
- Rédaction d'offres d'emploi attractives et inclusives
- Analyse et présélection de CV
- Génération de programmes de formation personnalisés
- Création de supports d'onboarding

Finance et comptabilité
- Analyse automatique de documents financiers
- Génération de rapports et synthèses
- Détection d'anomalies dans les transactions
- Aide à la rédaction de conformité réglementaire

Le point commun de tous ces cas d'usage : l'IA générative ne remplace pas les professionnels mais amplifie leur productivité et leur permet de se concentrer sur les tâches à haute valeur ajoutée.`,
                  quiz: {
                    create: {
                      title: "Quiz : Applications industrielles",
                      questions: {
                        create: [
                          {
                            text: "Quel est le rôle principal de l'IA générative dans la maintenance prédictive ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "L'IA générative analyse les données des capteurs et la documentation pour prédire les pannes et générer des diagnostics.",
                            options: {
                              create: [
                                {
                                  text: "Analyser les données pour prédire les pannes et générer des diagnostics",
                                  isCorrect: true,
                                },
                                {
                                  text: "Remplacer les techniciens de maintenance",
                                  isCorrect: false,
                                },
                                {
                                  text: "Réparer automatiquement les machines",
                                  isCorrect: false,
                                },
                                {
                                  text: "Construire de nouvelles machines",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                          {
                            text: "Selon le cours, quel est le point commun de toutes les applications de l'IA générative ?",
                            type: "single",
                            order: 2,
                            explanation:
                              "L'IA générative amplifie la productivité des professionnels sans les remplacer, leur permettant de se concentrer sur les tâches à haute valeur ajoutée.",
                            options: {
                              create: [
                                {
                                  text: "Elle amplifie la productivité sans remplacer les professionnels",
                                  isCorrect: true,
                                },
                                {
                                  text: "Elle remplace entièrement le travail humain",
                                  isCorrect: false,
                                },
                                {
                                  text: "Elle réduit les coûts de 90%",
                                  isCorrect: false,
                                },
                                {
                                  text: "Elle nécessite toujours une connexion internet",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Création du parcours 2 : Prompt Engineering Avancé...");

  const course2 = await prisma.course.create({
    data: {
      title: "Prompt Engineering Avancé pour l'Entreprise",
      slug: "prompt-engineering-avance",
      description:
        "Maîtrisez les techniques avancées de prompt engineering pour optimiser l'utilisation de l'IA générative dans un contexte professionnel et industriel.",
      category: "Prompt Engineering",
      difficulty: "intermediate",
      duration: "12 heures",
      published: true,
      modules: {
        create: [
          {
            title: "Techniques avancées de prompting",
            description:
              "Allez au-delà des bases et découvrez des techniques de prompting sophistiquées.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "System prompts et personnalisation",
                  order: 1,
                  type: "text",
                  content: `Le system prompt est l'instruction initiale qui définit le comportement, le ton et les contraintes d'un modèle de langage. Bien le maîtriser est essentiel pour des applications professionnelles.

Qu'est-ce qu'un system prompt ?
C'est un message spécial, distinct des messages utilisateur, qui configure le modèle avant toute interaction. Il définit :
- Le rôle et l'expertise du modèle
- Le ton et le style de communication
- Les contraintes et limites
- Le format de sortie attendu
- Les connaissances contextuelles spécifiques

Bonnes pratiques pour les system prompts :

1. Définir un rôle précis
"Tu es un expert en génie industriel avec 20 ans d'expérience dans l'automobile. Tu communiques de manière technique mais accessible."

2. Spécifier les contraintes
"Tu dois toujours citer tes sources. Si tu n'es pas sûr d'une information, indique-le clairement. Ne fais jamais d'affirmations sur des données que tu n'as pas."

3. Définir le format
"Réponds toujours en utilisant des listes à puces pour les points clés. Commence chaque réponse par un résumé en une phrase."

4. Inclure du contexte métier
Intégrez des informations spécifiques à votre entreprise : terminologie, processus, valeurs, produits. Cela rend les réponses beaucoup plus pertinentes.

5. Itérer et tester
Un bon system prompt se construit par itérations. Testez avec des questions variées, identifiez les failles et ajustez progressivement.

Le system prompt est votre outil principal pour transformer un LLM généraliste en un assistant spécialisé pour votre métier.`,
                  quiz: {
                    create: {
                      title: "Quiz : System prompts",
                      questions: {
                        create: [
                          {
                            text: "Quel est le rôle principal d'un system prompt ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "Le system prompt configure le comportement, le ton et les contraintes du modèle avant toute interaction utilisateur.",
                            options: {
                              create: [
                                {
                                  text: "Configurer le comportement et les contraintes du modèle",
                                  isCorrect: true,
                                },
                                {
                                  text: "Poser une question au modèle",
                                  isCorrect: false,
                                },
                                {
                                  text: "Entraîner le modèle sur de nouvelles données",
                                  isCorrect: false,
                                },
                                {
                                  text: "Mettre à jour le modèle",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  title: "RAG : Retrieval-Augmented Generation",
                  order: 2,
                  type: "text",
                  content: `Le RAG (Retrieval-Augmented Generation) est une technique qui combine la recherche d'information avec la génération de texte pour produire des réponses plus précises et à jour.

Pourquoi le RAG ?
Les LLM ont des limites intrinsèques :
- Leurs connaissances sont figées à la date d'entraînement
- Ils peuvent halluciner (inventer des faits)
- Ils ne connaissent pas vos données internes

Le RAG résout ces problèmes en injectant des informations pertinentes et vérifiées dans le contexte du modèle.

Architecture d'un système RAG :

1. Indexation des documents
Vos documents (PDF, emails, bases de données, wikis) sont découpés en chunks (fragments) et convertis en vecteurs numériques (embeddings) stockés dans une base vectorielle.

2. Recherche (Retrieval)
Quand un utilisateur pose une question, celle-ci est aussi convertie en vecteur. On recherche les chunks les plus similaires dans la base vectorielle.

3. Augmentation
Les chunks pertinents sont insérés dans le prompt du modèle, lui fournissant le contexte nécessaire pour répondre.

4. Génération
Le modèle génère une réponse basée sur les informations récupérées, avec des citations pour la traçabilité.

Bonnes pratiques RAG pour l'entreprise :
- Choisir la bonne taille de chunks (200-500 tokens généralement)
- Utiliser des embeddings de qualité (OpenAI, Cohere, sentence-transformers)
- Implémenter un re-ranking pour améliorer la pertinence
- Mettre à jour régulièrement l'index documentaire
- Évaluer la qualité avec des métriques (faithfulness, relevancy)

Le RAG est aujourd'hui la technique la plus utilisée pour créer des assistants IA d'entreprise qui exploitent vos données propriétaires.`,
                },
                {
                  title: "Chaînes de prompts et agents IA",
                  order: 3,
                  type: "text",
                  content: `Les chaînes de prompts et les agents IA représentent l'étape suivante dans l'utilisation des LLM : au lieu d'un simple échange question-réponse, on orchestre plusieurs étapes pour résoudre des problèmes complexes.

Les chaînes de prompts (Prompt Chaining)
Une chaîne de prompts décompose une tâche complexe en sous-tâches séquentielles, où la sortie d'un prompt devient l'entrée du suivant.

Exemple : Analyse d'un rapport industriel
Étape 1 : "Extrais les chiffres clés de ce rapport"
Étape 2 : "Identifie les tendances à partir de ces chiffres"
Étape 3 : "Génère des recommandations basées sur ces tendances"
Étape 4 : "Rédige un résumé exécutif avec les recommandations"

Les agents IA
Un agent IA va plus loin : c'est un système autonome qui peut :
- Planifier une séquence d'actions pour atteindre un objectif
- Utiliser des outils (recherche web, calculatrice, API, bases de données)
- S'adapter en fonction des résultats intermédiaires
- Boucler jusqu'à obtenir un résultat satisfaisant

Frameworks populaires pour les agents :
- LangChain : framework Python/JS très complet
- CrewAI : agents collaboratifs spécialisés
- AutoGen (Microsoft) : conversations multi-agents
- Claude Code Agent SDK : SDK pour construire des agents avec Claude

Cas d'usage industriels des agents :
- Assistant de recherche technique qui interroge plusieurs sources
- Agent de monitoring qui analyse des logs et génère des alertes
- Agent commercial qui qualifie les leads et rédige des propositions
- Agent de support qui résout les tickets en autonomie

Les agents IA sont encore en maturation mais représentent un changement de paradigme majeur : on passe de l'IA comme outil à l'IA comme collaborateur autonome.`,
                  quiz: {
                    create: {
                      title: "Quiz : Chaînes de prompts et agents",
                      questions: {
                        create: [
                          {
                            text: "Qu'est-ce que le RAG (Retrieval-Augmented Generation) ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "Le RAG combine la recherche d'informations dans une base documentaire avec la génération de texte pour des réponses plus précises et contextualisées.",
                            options: {
                              create: [
                                {
                                  text: "Une technique combinant recherche documentaire et génération de texte",
                                  isCorrect: true,
                                },
                                {
                                  text: "Un nouveau type de réseau de neurones",
                                  isCorrect: false,
                                },
                                {
                                  text: "Un langage de programmation pour l'IA",
                                  isCorrect: false,
                                },
                                {
                                  text: "Un outil de visualisation de données",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                          {
                            text: "Quelle est la différence principale entre une chaîne de prompts et un agent IA ?",
                            type: "single",
                            order: 2,
                            explanation:
                              "Un agent IA peut prendre des décisions autonomes, utiliser des outils et s'adapter, tandis qu'une chaîne de prompts suit une séquence prédéfinie.",
                            options: {
                              create: [
                                {
                                  text: "Un agent peut agir de manière autonome et utiliser des outils, une chaîne suit une séquence fixe",
                                  isCorrect: true,
                                },
                                {
                                  text: "Il n'y a aucune différence",
                                  isCorrect: false,
                                },
                                {
                                  text: "Les chaînes sont plus puissantes que les agents",
                                  isCorrect: false,
                                },
                                {
                                  text: "Les agents ne peuvent pas générer de texte",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(
    "Création du parcours 3 : Éthique et Gouvernance de l'IA Générative..."
  );

  const course3 = await prisma.course.create({
    data: {
      title: "Éthique et Gouvernance de l'IA Générative",
      slug: "ethique-gouvernance-ia",
      description:
        "Comprenez les enjeux éthiques, juridiques et de gouvernance liés à l'utilisation de l'IA générative en entreprise. Apprenez à déployer l'IA de manière responsable.",
      category: "Gouvernance IA",
      difficulty: "intermediate",
      duration: "6 heures",
      published: true,
      modules: {
        create: [
          {
            title: "Les enjeux éthiques de l'IA Générative",
            description:
              "Identifier et comprendre les principaux défis éthiques posés par l'IA générative.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Biais, hallucinations et fiabilité",
                  order: 1,
                  type: "text",
                  content: `L'IA générative soulève des questions éthiques fondamentales que tout professionnel doit comprendre et anticiper.

Les biais algorithmiques
Les modèles d'IA apprennent à partir de données qui reflètent les biais existants dans la société. Cela peut se manifester par :
- Des stéréotypes de genre dans la génération de texte et d'images
- Des biais culturels favorisant certaines perspectives
- Des discriminations involontaires dans les systèmes de recrutement
- Une sous-représentation de certaines langues et cultures

Comment atténuer les biais :
- Diversifier les données d'entraînement
- Tester systématiquement les sorties pour détecter les biais
- Mettre en place des processus de revue humaine
- Utiliser des techniques de débiaisage

Les hallucinations
Les LLM peuvent générer des informations fausses mais présentées avec assurance. C'est l'un des défis majeurs de l'IA générative.

Types d'hallucinations :
- Factuelles : dates, chiffres, événements inventés
- De référence : citations ou sources inexistantes
- Logiques : raisonnements incorrects mais convaincants

Stratégies de mitigation :
- Vérification humaine systématique des contenus critiques
- Utilisation du RAG pour ancrer les réponses dans des sources fiables
- Demander au modèle d'indiquer son niveau de confiance
- Implémenter des mécanismes de fact-checking automatique

La fiabilité
Pour un usage professionnel, il est essentiel de :
- Ne jamais faire confiance aveuglément aux sorties de l'IA
- Mettre en place des processus de validation
- Éduquer les utilisateurs sur les limites des modèles
- Documenter les cas d'usage approuvés et interdits`,
                  quiz: {
                    create: {
                      title: "Quiz : Éthique de l'IA",
                      questions: {
                        create: [
                          {
                            text: "Qu'est-ce qu'une hallucination dans le contexte des LLM ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "Une hallucination est la génération d'informations fausses mais présentées avec assurance par le modèle.",
                            options: {
                              create: [
                                {
                                  text: "La génération d'informations fausses présentées comme vraies",
                                  isCorrect: true,
                                },
                                {
                                  text: "Un bug dans le code du modèle",
                                  isCorrect: false,
                                },
                                {
                                  text: "Un effet visuel dans la génération d'images",
                                  isCorrect: false,
                                },
                                {
                                  text: "Une fonctionnalité avancée du modèle",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  title: "Cadre réglementaire : l'AI Act européen",
                  order: 2,
                  type: "text",
                  content: `L'Union Européenne a adopté l'AI Act, le premier cadre réglementaire complet au monde pour l'intelligence artificielle. Comprendre ce règlement est indispensable pour les entreprises européennes.

Les grandes lignes de l'AI Act :

Classification par niveaux de risque :
1. Risque inacceptable (interdit) : surveillance de masse, manipulation subliminale, scoring social
2. Haut risque : recrutement, éducation, crédit, justice, infrastructures critiques
3. Risque limité : chatbots, deepfakes (obligation de transparence)
4. Risque minimal : jeux vidéo, filtres spam (pas de contrainte spécifique)

Obligations pour les systèmes à haut risque :
- Évaluation de conformité avant mise sur le marché
- Gestion des risques documentée
- Qualité et gouvernance des données d'entraînement
- Documentation technique complète
- Transparence vis-à-vis des utilisateurs
- Supervision humaine
- Robustesse, précision et cybersécurité

Obligations spécifiques pour l'IA générative :
- Divulguer que le contenu est généré par IA
- Concevoir le modèle pour empêcher la génération de contenu illicite
- Publier un résumé des données d'entraînement protégées par le droit d'auteur

Calendrier de mise en œuvre :
L'AI Act entre en application progressivement entre 2024 et 2027, avec des délais différents selon les niveaux de risque.

Impact pour les entreprises :
- Nécessité d'inventorier tous les systèmes d'IA utilisés
- Mise en conformité des systèmes à haut risque
- Formation des équipes aux nouvelles obligations
- Mise en place d'une gouvernance IA interne

Les sanctions peuvent aller jusqu'à 35 millions d'euros ou 7% du chiffre d'affaires mondial. Il est donc crucial de se préparer dès maintenant.`,
                },
                {
                  title: "Mettre en place une gouvernance IA en entreprise",
                  order: 3,
                  type: "text",
                  content: `Déployer l'IA générative de manière responsable en entreprise nécessite une gouvernance structurée. Voici un cadre pratique.

Les piliers d'une gouvernance IA :

1. Politique d'utilisation de l'IA
Rédigez une politique claire qui définit :
- Les cas d'usage autorisés et interdits
- Les niveaux de validation requis
- Les données qui peuvent être partagées avec les modèles
- Les responsabilités de chacun

2. Comité IA / IA Responsable
Mettez en place un comité transverse incluant :
- Direction générale (sponsorship)
- DSI / CTO (aspects techniques)
- Juridique (conformité)
- RH (impact humain)
- Métiers (cas d'usage)
- DPO (protection des données)

3. Processus d'évaluation des risques
Avant chaque déploiement d'IA :
- Identifier les risques (biais, sécurité, confidentialité, fiabilité)
- Évaluer l'impact potentiel
- Définir les mesures de mitigation
- Planifier le monitoring post-déploiement

4. Protection des données
- Ne jamais envoyer de données sensibles dans des API publiques
- Privilégier les déploiements on-premise ou les environnements sécurisés
- Respecter le RGPD et l'AI Act
- Informer les personnes concernées

5. Formation et sensibilisation
- Former tous les collaborateurs aux bases de l'IA générative
- Former les utilisateurs avancés aux bonnes pratiques
- Sensibiliser aux risques (hallucinations, biais, sécurité)
- Créer une communauté interne de partage

6. Monitoring et amélioration continue
- Suivre les indicateurs de performance et de qualité
- Collecter les retours utilisateurs
- Auditer régulièrement les systèmes
- Adapter la gouvernance aux évolutions réglementaires

Une bonne gouvernance IA n'est pas un frein à l'innovation : c'est un accélérateur de confiance qui permet un déploiement serein et durable.`,
                  quiz: {
                    create: {
                      title: "Quiz : Gouvernance IA",
                      questions: {
                        create: [
                          {
                            text: "Quel est le premier cadre réglementaire complet au monde pour l'IA ?",
                            type: "single",
                            order: 1,
                            explanation:
                              "L'AI Act européen est le premier cadre réglementaire complet au monde dédié à l'intelligence artificielle.",
                            options: {
                              create: [
                                {
                                  text: "L'AI Act de l'Union Européenne",
                                  isCorrect: true,
                                },
                                {
                                  text: "Le RGPD",
                                  isCorrect: false,
                                },
                                {
                                  text: "Le Digital Services Act",
                                  isCorrect: false,
                                },
                                {
                                  text: "Le CCPA californien",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                          {
                            text: "Que doit inclure un comité de gouvernance IA en entreprise ?",
                            type: "single",
                            order: 2,
                            explanation:
                              "Un comité IA efficace doit être transverse et inclure la direction, le technique, le juridique, les RH et les métiers.",
                            options: {
                              create: [
                                {
                                  text: "Des représentants transverses : direction, technique, juridique, RH et métiers",
                                  isCorrect: true,
                                },
                                {
                                  text: "Uniquement des développeurs",
                                  isCorrect: false,
                                },
                                {
                                  text: "Uniquement la direction générale",
                                  isCorrect: false,
                                },
                                {
                                  text: "Des consultants externes uniquement",
                                  isCorrect: false,
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed terminé avec succès !");
  console.log(`  - ${admin.email} (admin, mot de passe: admin123)`);
  console.log(`  - ${learner.email} (apprenant, mot de passe: user123)`);
  console.log(`  - 3 parcours créés avec modules, leçons et quiz`);
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
