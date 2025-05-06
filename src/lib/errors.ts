// Types d'erreurs personnalisés
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'AUTH_ERROR', 401, details)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'NOT_FOUND', 404, details)
    this.name = 'NotFoundError'
  }
}

// Gestionnaire d'erreurs pour les routes API
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details
      },
      statusCode: error.statusCode
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: 'INTERNAL_ERROR'
      },
      statusCode: 500
    }
  }

  return {
    success: false,
    error: {
      message: 'Une erreur inattendue est survenue',
      code: 'UNKNOWN_ERROR'
    },
    statusCode: 500
  }
}

// Utilitaire pour la validation des données
export function validateRequired<T extends object>(data: T, requiredFields: (keyof T)[]) {
  const missingFields = requiredFields.filter(field => !data[field])
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Champs requis manquants: ${missingFields.join(', ')}`,
      { missingFields }
    )
  }
}

// Messages d'erreur standardisés
export const ErrorMessages = {
  AUTH: {
    SESSION_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.',
    INVALID_CREDENTIALS: 'Identifiants invalides.',
    UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action.'
  },
  API: {
    NETWORK_ERROR: 'Erreur de connexion au serveur.',
    TIMEOUT: 'Le serveur met trop de temps à répondre.',
    VALIDATION: 'Les données fournies sont invalides.'
  },
  DATA: {
    NOT_FOUND: 'Les données demandées n\'ont pas été trouvées.',
    SAVE_ERROR: 'Erreur lors de la sauvegarde des données.'
  }
} 