'use client';

import Link from 'next/link';
import { Calendar, Users, QrCode, BarChart3 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gerencie seus Eventos com
            <span className="block text-blue-200">Facilidade e Eficiência</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            O EventSync é a solução completa para organizadores de eventos. 
            Crie, gerencie e acompanhe seus eventos com ferramentas poderosas 
            de inscrição, QR codes e métricas em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Começar Agora
            </Link>
            <Link href="/demo" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
              Ver Demonstração
            </Link>
          </div>
        </div>

        {/* Recursos Principais */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestão de Eventos</h3>
            <p className="text-blue-100">Crie e organize eventos de forma simples e intuitiva</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Inscrições</h3>
            <p className="text-blue-100">Sistema completo de inscrições e confirmações</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">QR Codes</h3>
            <p className="text-blue-100">Check-in rápido e eficiente com QR codes únicos</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Métricas</h3>
            <p className="text-blue-100">Acompanhe o sucesso dos seus eventos em tempo real</p>
          </div>
        </div>
      </div>
    </section>
  );
}
