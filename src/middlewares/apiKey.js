const validateApiKey = (req, res, next) => {
  // Busca a chave enviada no cabeçalho (header) da requisição
  const apiKey = req.header('x-api-key');

  // Compara com a chave que está no seu arquivo .env
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      error: "Acesso negado. API Key inválida ou ausente."
    });
  }

  // Se estiver tudo certo, deixa passar para a rota
  next();
};

module.exports = validateApiKey;