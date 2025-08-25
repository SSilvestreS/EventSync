'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import EventList from '../components/EventList';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  const [events] = useState([
    {
      id: 1,
      title: 'Workshop de Desenvolvimento Web',
      description: 'Aprenda as melhores práticas de desenvolvimento web moderno',
      date: '2024-02-15',
      time: '14:00',
      location: 'Centro de Inovação',
      capacity: 50,
      registered: 35,
      image: '/images/workshop-web.jpg',
      category: 'Tecnologia'
    },
    {
      id: 2,
      title: 'Palestra sobre Inteligência Artificial',
      description: 'Descubra como a IA está transformando diferentes setores',
      date: '2024-02-20',
      time: '19:00',
      location: 'Auditório Principal',
      capacity: 100,
      registered: 78,
      image: '/images/palestra-ia.jpg',
      category: 'Tecnologia'
    },
    {
      id: 3,
      title: 'Workshop de Marketing Digital',
      description: 'Estratégias eficazes para marketing nas redes sociais',
      date: '2024-02-25',
      time: '15:30',
      location: 'Sala de Treinamento',
      capacity: 30,
      registered: 25,
      image: '/images/workshop-marketing.jpg',
      category: 'Marketing'
    }
  ]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EventList events={events} />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
