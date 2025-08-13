<?php
// Configurações dinâmicas do site
date_default_timezone_set('America/Sao_Paulo');

// Dados dinâmicos do portfólio
$portfolio_data = [
    'name' => 'Gabriel Politano',
    'title' => 'Desenvolvedor Web & Estudante de Sistemas de Informação',
    'institution' => 'FIAP',
    'description' => 'Apaixonado por criar soluções inteligentes e funcionais, aliando código limpo, performance e design responsivo. Dedico horas todos os dias a aprimorar minhas habilidades e explorar novas tecnologias.',
    'mission' => 'Ao me incluir na sua equipe, você contará com alguém incansável na busca por resultados, capaz de criar o que não existe e melhorar o que já foi criado.',
    'email' => 'gabriel.cpolitano@gmail.com',
    'phone' => '+55 (17) 99649-0503',
    'location' => 'São Paulo, SP',
    'hero_image' => 'https://raw.githubusercontent.com/gabrielcpolitano/teste/refs/heads/main/api/hero.jpg', // URL da imagem do hero
    'hero_image_alt' => 'Foto de Gabriel Politano - Desenvolvedor Web'
];

// Skills dinâmicas
$skills = [
    'languages' => [
        ['name' => 'PHP', 'level' => 90, 'color' => 'primary'],
        ['name' => 'JavaScript', 'level' => 85, 'color' => 'accent'],
        ['name' => 'HTML5', 'level' => 95, 'color' => 'secondary'],
        ['name' => 'CSS3', 'level' => 90, 'color' => 'primary']
    ],
    'tools' => [
        ['name' => 'Tailwind CSS', 'level' => 88, 'color' => 'accent'],
        ['name' => 'WordPress', 'level' => 82, 'color' => 'secondary'],
        ['name' => 'MySQL', 'level' => 80, 'color' => 'primary'],
        ['name' => 'Git', 'level' => 85, 'color' => 'accent']
    ]
];

// Projetos dinâmicos
$projects = [
    [
        'title' => 'Sistema de Vendas de Tickets',
        'description' => 'Desenvolvimento de sistema básico para informar e direcionar clientes',
        'technologies' => ['HTML', 'CSS3', 'JavaScript', 'Bootstrap'],
        'status' => 'Concluído',
        'date' => '2024',
        'image' => 'https://raw.githubusercontent.com/gabrielcpolitano/teste/refs/heads/main/api/project1.png',
        'image_alt' => 'Screenshot do Sistema de Vendas de Tickets',
        'ver_detalhes' => 'https://elistickets.com/'
    ],
    [
        'title' => 'E-commerce Simplificado',
        'description' => 'Loja virtual com design responsivo',
        'technologies' => ['HTML', 'CSS3', 'Tailwind', 'JavaScript'],
        'status' => 'Concluído',
        'date' => '2025',
        'image' => 'https://raw.githubusercontent.com/gabrielcpolitano/teste/refs/heads/main/api/project2.png',
        'image_alt' => 'Screenshot da Loja Virtual E-commerce',
        'ver_detalhes' => 'https://sandraboleira.com/'
    ],
    [
        'title' => 'Landing Page Corporativa',
        'description' => 'Página de apresentação moderna com foco em conversão e performance.',
        'technologies' => ['HTML5', 'CSS3', 'JavaScript'],
        'status' => 'Concluído',
        'date' => '2025',
        'image' => 'https://raw.githubusercontent.com/gabrielcpolitano/teste/refs/heads/main/api/project3.png',
        'image_alt' => 'Screenshot da Landing Page Corporativa',
        'ver_detalhes' => 'https://2-gb-burger.vercel.app/'
    ],
    [
        'title' => 'PHP Project',
        'description' => 'Loja virtual com design responsivo',
        'technologies' => ['HTML', 'CSS3', 'PHP', 'JavaScript'],
        'status' => 'Em desenvolvimento',
        'date' => '2025',
        'image' => './project.png',
        'image_alt' => 'Screenshot da Loja Virtual E-commerce',
        'ver_detalhes' => 'https://www.google.com/'
    ],
];

// Estatísticas dinâmicas
$stats = [
    ['number' => count($projects), 'label' => 'Projetos Concluídos'],
    ['number' => 2, 'label' => 'Anos de Experiência'],
    ['number' => count($skills['languages']) + count($skills['tools']), 'label' => 'Tecnologias'],
    ['number' => 100, 'label' => '% Dedicação']
];

// Processar envio do formulário
$message_sent = false;
$message_error = false;
$form_data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_form'])) {
    $form_data['name'] = htmlspecialchars($_POST['name'] ?? '');
    $form_data['email'] = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $form_data['subject'] = htmlspecialchars($_POST['subject'] ?? '');
    $form_data['message'] = htmlspecialchars($_POST['message'] ?? '');
    
    if ($form_data['name'] && $form_data['email'] && $form_data['message']) {
        $message_sent = true;
        // Log da mensagem recebida
        $log_entry = date('Y-m-d H:i:s') . " - Contato de: {$form_data['name']} ({$form_data['email']})\n";
        file_put_contents('contacts.log', $log_entry, FILE_APPEND | LOCK_EX);
    } else {
        $message_error = true;
    }
}

// Função para calcular tempo de carregamento
$start_time = microtime(true);

// Função para gerar saudação baseada no horário
function getGreeting() {
    $hour = date('H');
    if ($hour < 12) return 'Bom dia!';
    if ($hour < 18) return 'Boa tarde!';
    return 'Boa noite!';
}

// Função para calcular idade do projeto (dias desde a criação)
function getProjectAge() {
    $creation_date = '2025-01-01'; // Data fictícia de criação
    $now = new DateTime();
    $created = new DateTime($creation_date);
    return $now->diff($created)->days;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Gabriel Politano - Desenvolvedor e Estudante de Sistemas de Informação na FIAP. Especialista em PHP, JavaScript, HTML, CSS e WordPress.">
    <meta name="keywords" content="Gabriel Politano, desenvolvedor, PHP, JavaScript, HTML, CSS, WordPress, FIAP, Sistemas de Informação">
    <title>Gabriel Politano - Desenvolvedor Web</title>
    <link rel="icon" type="image/svg+xml" href="https://raw.githubusercontent.com/gabrielcpolitano/teste/6de2b2a5c10ff1e585ac54918588b1143140c83e/api/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#3B82F6',
                        secondary: '#1E40AF',
                        accent: '#3B82F6',
                        dark: '#111827',
                        light: '#F9FAFB'
                    }
                }
            }
        }
    </script>
    <style>
        .fade-in {
            animation: fadeIn 1s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .bounce-slow {
            animation: bounce 2s infinite;
        }
        
        .gradient-text {
            background: linear-gradient(135deg, #3B82F6, #1E40AF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .skill-bar {
            transition: width 2s ease-in-out;
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-800">
    
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="font-bold text-xl gradient-text"><?php echo $portfolio_data['name']; ?></div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="text-gray-600 hover:text-primary transition-colors">Início</a>
                    <a href="#about" class="text-gray-600 hover:text-primary transition-colors">Sobre</a>
                    <a href="#skills" class="text-gray-600 hover:text-primary transition-colors">Habilidades</a>
                    <a href="#projects" class="text-gray-600 hover:text-primary transition-colors">Projetos</a>
                    <a href="#contact" class="text-gray-600 hover:text-primary transition-colors">Contato</a>
                </div>
                <button id="mobile-menu-btn" class="md:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
                <div class="flex flex-col space-y-4">
                    <a href="#home" class="text-gray-600 hover:text-primary transition-colors">Início</a>
                    <a href="#about" class="text-gray-600 hover:text-primary transition-colors">Sobre</a>
                    <a href="#skills" class="text-gray-600 hover:text-primary transition-colors">Habilidades</a>
                    <a href="#projects" class="text-gray-600 hover:text-primary transition-colors">Projetos</a>
                    <a href="#contact" class="text-gray-600 hover:text-primary transition-colors">Contato</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20 pt-20">
        <div class="container mx-auto px-6">
            <div class="flex flex-col lg:flex-row items-center justify-between">
                <div class="lg:w-1/2 text-center lg:text-left fade-in">
                    <div class="mb-4 text-lg text-blue-600 font-semibold"><?php echo getGreeting(); ?></div>
                    <h1 class="text-5xl lg:text-6xl font-bold mb-6">
                        Olá, eu sou <span class="gradient-text"><?php echo $portfolio_data['name']; ?></span>
                    </h1>
                    <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                        <?php echo $portfolio_data['title']; ?> na <?php echo $portfolio_data['institution']; ?>
                    </p>
                    <p class="text-lg text-gray-700 mb-8 leading-relaxed">
                        <?php echo $portfolio_data['description']; ?>
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#projects" class="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors inline-block text-center">
                            Ver Projetos
                        </a>
                        <a href="#contact" class="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors inline-block text-center">
                            Entrar em Contato
                        </a>
                    </div>
                </div>
                
                <div class="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
                    <div class="relative">
                        <?php if (!empty($portfolio_data['hero_image'])): ?>
                            <!-- Foto do Gabriel -->
                            <div class="w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                                <img src="<?php echo htmlspecialchars($portfolio_data['hero_image']); ?>" 
                                     alt="<?php echo htmlspecialchars($portfolio_data['hero_image_alt']); ?>"
                                     class="w-full h-full object-cover">
                            </div>
                        <?php else: ?>
                            <!-- Fallback com iniciais -->
                            <div class="w-80 h-80 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                                <?php echo strtoupper(substr($portfolio_data['name'], 0, 1) . substr(strstr($portfolio_data['name'], ' '), 1, 1)); ?>
                            </div>
                        <?php endif; ?>
                        
                        <!-- Decorative elements -->
                        <div class="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full opacity-20 bounce-slow"></div>
                        <div class="absolute -bottom-6 -left-6 w-16 h-16 bg-primary rounded-full opacity-30 bounce-slow" style="animation-delay: 1s;"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold gradient-text mb-4">Sobre Mim</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Conheça mais sobre minha jornada e experiência
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div class="fade-in">
                        <h3 class="text-2xl font-bold mb-6">Minha Jornada</h3>
                        <p class="text-gray-700 mb-6 leading-relaxed">
                            Sou estudante de Sistemas de Informação na FIAP, uma das principais 
                            instituições de tecnologia do Brasil. Durante minha formação, tenho 
                            desenvolvido uma sólida base técnica e prática em desenvolvimento web.
                        </p>
                        <p class="text-gray-700 mb-6 leading-relaxed">
                            Minha experiência abrange tecnologias front-end e back-end, com foco 
                            especial em PHP, JavaScript, HTML, CSS, Tailwind CSS e WordPress. 
                            Tenho paixão por criar soluções que não apenas funcionam, mas que 
                            oferecem uma experiência excepcional aos usuários.
                        </p>
                        <p class="text-gray-700 leading-relaxed">
                            <strong><?php echo $portfolio_data['mission']; ?></strong>
                        </p>
                        
                        <!-- Estatísticas dinâmicas -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-white rounded-lg shadow-sm">
                            <?php foreach ($stats as $stat): ?>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-primary"><?php echo $stat['number']; ?></div>
                                <div class="text-sm text-gray-600"><?php echo $stat['label']; ?></div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-lg">
                        <h3 class="text-2xl font-bold mb-6">Formação & Experiência</h3>
                        <div class="space-y-6">
                            <div class="flex items-start space-x-4">
                                <div class="w-3 h-3 bg-primary rounded-full mt-2"></div>
                                <div>
                                    <h4 class="font-semibold text-lg">Sistemas de Informação</h4>
                                    <p class="text-gray-600">FIAP - Em andamento</p>
                                    <p class="text-sm text-gray-500">Fundamentos sólidos em desenvolvimento e tecnologia</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-4">
                                <div class="w-3 h-3 bg-accent rounded-full mt-2"></div>
                                <div>
                                    <h4 class="font-semibold text-lg">Desenvolvimento Web</h4>
                                    <p class="text-gray-600">Experiência Prática</p>
                                    <p class="text-sm text-gray-500">PHP, JavaScript, HTML, CSS, WordPress</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-4">
                                <div class="w-3 h-3 bg-secondary rounded-full mt-2"></div>
                                <div>
                                    <h4 class="font-semibold text-lg">Design Responsivo</h4>
                                    <p class="text-gray-600">Especialização</p>
                                    <p class="text-sm text-gray-500">Tailwind CSS, Mobile-First Design</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold gradient-text mb-4">Habilidades Técnicas</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Tecnologias e ferramentas que domino para criar soluções eficientes
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto">
                <div class="grid md:grid-cols-2 gap-12">
                    <div class="fade-in">
                        <h3 class="text-2xl font-bold mb-8">Linguagens & Frameworks</h3>
                        
                        <div class="space-y-6">
                            <?php foreach ($skills['languages'] as $skill): ?>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="font-semibold"><?php echo $skill['name']; ?></span>
                                    <span class="text-gray-600"><?php echo $skill['level']; ?>%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="skill-bar bg-<?php echo $skill['color']; ?> h-3 rounded-full" style="width: <?php echo $skill['level']; ?>%"></div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <div class="fade-in">
                        <h3 class="text-2xl font-bold mb-8">Ferramentas & Tecnologias</h3>
                        
                        <div class="space-y-6">
                            <?php foreach ($skills['tools'] as $skill): ?>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="font-semibold"><?php echo $skill['name']; ?></span>
                                    <span class="text-gray-600"><?php echo $skill['level']; ?>%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="skill-bar bg-<?php echo $skill['color']; ?> h-3 rounded-full" style="width: <?php echo $skill['level']; ?>%"></div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                
                <!-- Soft Skills -->
                <div class="mt-16">
                    <h3 class="text-2xl font-bold text-center mb-8">Competências Profissionais</h3>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="text-center p-6 bg-white rounded-lg shadow-sm card-hover">
                            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-lg mb-2">Criatividade</h4>
                            <p class="text-gray-600 text-sm">Capacidade de criar soluções inovadoras e funcionais</p>
                        </div>
                        
                        <div class="text-center p-6 bg-white rounded-lg shadow-sm card-hover">
                            <div class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-lg mb-2">Performance</h4>
                            <p class="text-gray-600 text-sm">Foco em código limpo e aplicações otimizadas</p>
                        </div>
                        
                        <div class="text-center p-6 bg-white rounded-lg shadow-sm card-hover">
                            <div class="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h4 class="font-semibold text-lg mb-2">Aprendizado</h4>
                            <p class="text-gray-600 text-sm">Dedicação diária ao aprimoramento contínuo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-5xl font-bold gradient-text mb-5 py-5">Projetos</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Alguns dos projetos que demonstram minhas habilidades técnicas
                </p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php foreach ($projects as $index => $project): 
                    $gradients = [
                        'from-primary to-secondary',
                        'from-accent to-yellow-500', 
                        'from-secondary to-blue-600'
                    ];
                    $icons = [
                        'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                        'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9',
                        'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
                    ];
                ?>
                <div class="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
                    <?php if (!empty($project['image'])): ?>
                        <!-- Imagem do projeto -->
                        <div class="h-48 overflow-hidden">
                            <img src="<?php echo htmlspecialchars($project['image']); ?>" 
                                 alt="<?php echo htmlspecialchars($project['image_alt']); ?>"
                                 class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                        </div>
                    <?php else: ?>
                        <!-- Fallback com ícone -->
                        <div class="h-48 bg-gradient-to-br <?php echo $gradients[$index % 3]; ?> flex items-center justify-center">
                            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?php echo $icons[$index % 3]; ?>"></path>
                            </svg>
                        </div>
                    <?php endif; ?>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold"><?php echo $project['title']; ?></h3>
                            <span class="text-xs px-2 py-1 bg-<?php echo $project['status'] === 'Concluído' ? 'green' : 'blue'; ?>-100 text-<?php echo $project['status'] === 'Concluído' ? 'green' : 'blue'; ?>-800 rounded-full">
                                <?php echo $project['status']; ?>
                            </span>
                        </div>
                        <p class="text-gray-600 mb-4"><?php echo $project['description']; ?></p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <?php foreach ($project['technologies'] as $tech): ?>
                            <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"><?php echo $tech; ?></span>
                            <?php endforeach; ?>
                        </div>
                        <div class="flex justify-between items-center">
                            <?php if (!empty($project['ver_detalhes'])): ?>
                                <a href="<?php echo htmlspecialchars($project['ver_detalhes']); ?>" target="_blank" class="text-primary font-semibold hover:underline transition-colors">
                                    Ver Detalhes →
                                </a>
                            <?php else: ?>
                                <span class="text-gray-400 font-semibold">Em breve</span>
                            <?php endif; ?>
                            <span class="text-sm text-gray-500"><?php echo $project['date']; ?></span>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gradient-to-br from-primary/10 to-secondary/20">
        <div class="container mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold gradient-text mb-4">Entre em Contato</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Vamos conversar sobre como posso contribuir com seus projetos
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto">
                <div class="grid md:grid-cols-2 gap-12">
                    <div class="fade-in">
                        <h3 class="text-2xl font-bold mb-6">Vamos Trabalhar Juntos</h3>
                        <p class="text-gray-700 mb-8 leading-relaxed">
                            Estou sempre em busca de novos desafios e oportunidades para aplicar 
                            minhas habilidades técnicas. Se você está procurando por alguém dedicado, 
                            criativo e focado em resultados, adoraria fazer parte da sua equipe.
                        </p>
                        
                        <div class="space-y-6">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Email</h4>
                                    <p class="text-gray-600"><?php echo $portfolio_data['email']; ?></p>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Telefone</h4>
                                    <p class="text-gray-600"><?php echo $portfolio_data['phone']; ?></p>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Localização</h4>
                                    <p class="text-gray-600"><?php echo $portfolio_data['location']; ?></p>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold">Disponibilidade</h4>
                                    <p class="text-gray-600">Disponível para novos projetos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-lg p-8">
                        <?php if ($message_sent): ?>
                        <div class="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span class="font-semibold">Mensagem enviada com sucesso!</span>
                            </div>
                            <p class="mt-1 text-sm">Obrigado pelo contato, <?php echo htmlspecialchars($form_data['name']); ?>! Retornarei em breve.</p>
                        </div>
                        <?php endif; ?>
                        
                        <?php if ($message_error): ?>
                        <div class="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            <div class="flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="font-semibold">Erro ao enviar mensagem</span>
                            </div>
                            <p class="mt-1 text-sm">Por favor, verifique os dados e tente novamente.</p>
                        </div>
                        <?php endif; ?>
                        
                        <form id="contact-form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
                            <input type="hidden" name="contact_form" value="1">
                            
                            <div class="mb-6">
                                <label for="name" class="block text-gray-700 font-semibold mb-2">Nome</label>
                                <input type="text" id="name" name="name" required 
                                       value="<?php echo htmlspecialchars($form_data['name'] ?? ''); ?>"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            
                            <div class="mb-6">
                                <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
                                <input type="email" id="email" name="email" required 
                                       value="<?php echo htmlspecialchars($form_data['email'] ?? ''); ?>"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            
                            <div class="mb-6">
                                <label for="subject" class="block text-gray-700 font-semibold mb-2">Assunto</label>
                                <input type="text" id="subject" name="subject" 
                                       value="<?php echo htmlspecialchars($form_data['subject'] ?? ''); ?>"
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            
                            <div class="mb-6">
                                <label for="message" class="block text-gray-700 font-semibold mb-2">Mensagem</label>
                                <textarea id="message" name="message" rows="5" required 
                                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"><?php echo htmlspecialchars($form_data['message'] ?? ''); ?></textarea>
                            </div>
                            
                            <button type="submit" 
                                    class="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                Enviar Mensagem
                            </button>
                        </form>
                        
                        <!-- Messages -->
                        <div id="form-messages" class="mt-4 hidden">
                            <div id="success-message" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg hidden">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span class="font-semibold">Mensagem enviada com sucesso!</span>
                                </div>
                                <p class="mt-1 text-sm">Obrigado pelo contato. Retornarei em breve!</p>
                            </div>
                            
                            <div id="error-message" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg hidden">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span class="font-semibold">Erro ao enviar mensagem</span>
                                </div>
                                <p class="mt-1 text-sm">Por favor, verifique os dados e tente novamente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-12">
        <div class="container mx-auto px-6">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4">Gabriel Politano</h3>
                <p class="text-gray-300 mb-6">
                    <?php echo $portfolio_data['title']; ?> na <?php echo $portfolio_data['institution']; ?>
                </p>
                
               
                
                <p class="text-gray-400 text-sm">
                    © <?php echo date('Y'); ?> <?php echo $portfolio_data['name']; ?>. Desenvolvido com dedicação e paixão por tecnologia.
                   
                </p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script>
        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Form Handling with Formspree
        const contactForm = document.getElementById('contact-form');
        const formMessages = document.getElementById('form-messages');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            // Update button state
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            try {
                const response = await fetch('https://formspree.io/f/xeoznynq', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    formMessages.classList.remove('hidden');
                    successMessage.classList.remove('hidden');
                    errorMessage.classList.add('hidden');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessages.classList.add('hidden');
                        successMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                // Show error message
                formMessages.classList.remove('hidden');
                errorMessage.classList.remove('hidden');
                successMessage.classList.add('hidden');
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessages.classList.add('hidden');
                    errorMessage.classList.add('hidden');
                }, 5000);
            } finally {
                // Restore button state
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
            }
        });

        // Animate skill bars on scroll
        const skillBars = document.querySelectorAll('.skill-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.style.width || '0%';
                }
            });
        });

        skillBars.forEach(bar => {
            observer.observe(bar);
        });

        // Add fade-in animation on scroll
        const fadeElements = document.querySelectorAll('.fade-in');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 1s ease-in';
                }
            });
        });

        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });

        <?php if ($message_sent): ?>
        // Show PHP success message
        window.addEventListener('load', function() {
            formMessages.classList.remove('hidden');
            successMessage.classList.remove('hidden');
            setTimeout(() => {
                formMessages.classList.add('hidden');
                successMessage.classList.add('hidden');
            }, 5000);
        });
        <?php elseif ($message_error): ?>
        // Show PHP error message
        window.addEventListener('load', function() {
            formMessages.classList.remove('hidden');
            errorMessage.classList.remove('hidden');
            setTimeout(() => {
                formMessages.classList.add('hidden');
                errorMessage.classList.add('hidden');
            }, 5000);
        });
        <?php endif; ?>
    </script>
</body>
</html>
