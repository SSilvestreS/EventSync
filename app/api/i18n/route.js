import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import i18nService from '../../../lib/i18nService';

// GET /api/i18n - Obtém configurações de idioma
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let result;

    switch (type) {
      case 'languages':
        result = i18nService.getSupportedLanguages();
        break;
      case 'regions':
        result = i18nService.getLanguagesByRegion();
        break;
      case 'families':
        result = i18nService.getLanguagesByFamily();
        break;
      case 'popular':
        result = await i18nService.getPopularLanguages();
        break;
      case 'stats':
        result = await i18nService.getLanguageUsageStats();
        break;
      case 'user':
        result = await i18nService.getUserLanguagePreferences(session.user.id);
        break;
      default:
        result = {
          currentLanguage: i18nService.getCurrentLanguage(),
          supportedLanguages: i18nService.getSupportedLanguages(),
          defaultLanguage: i18nService.defaultLanguage,
          fallbackLanguage: i18nService.fallbackLanguage
        };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao obter configurações de idioma:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/i18n - Define idioma do usuário
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { language, preferences } = body;

    let result;

    if (preferences) {
      // Define preferências completas de idioma
      result = await i18nService.setUserLanguagePreferences(session.user.id, preferences);
    } else if (language) {
      // Define apenas o idioma
      result = await i18nService.setUserLanguage(session.user.id, language);
    } else {
      return NextResponse.json({ error: 'Idioma ou preferências são obrigatórios' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erro ao definir idioma:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/i18n - Atualiza preferências de idioma
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json({ error: 'Preferências são obrigatórias' }, { status: 400 });
    }

    const result = await i18nService.setUserLanguagePreferences(session.user.id, preferences);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erro ao atualizar preferências de idioma:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
