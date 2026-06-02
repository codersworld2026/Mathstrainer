import React, { useState } from 'react';
import EnglishHome from './EnglishHome.jsx';
import PeelPractice from './PeelPractice.jsx';
import TwelfthNight from './TwelfthNight.jsx';
import Characters from './Characters.jsx';
import Symbolism from './Symbolism.jsx';
import ExtractQuestions from './ExtractQuestions.jsx';

// English Trainer area. Self-contained, state-driven navigation (the app has no
// router) — page keys mirror the /english/* routes. Holds no maths data/state.
//   home · peel · twelfth · characters · symbolism · extracts
export default function English({ studentName = 'there' }) {
  const [page, setPage] = useState('home');
  const [peelExtractId, setPeelExtractId] = useState(null);
  const [peelBack, setPeelBack] = useState('home');

  // open the PEEL builder, optionally with a chosen extract + where to go back to
  const openPeel = (extractId = null, from = 'home') => {
    setPeelExtractId(extractId);
    setPeelBack(from);
    setPage('peel');
  };

  // EnglishHome cards: 'peel' goes to the builder; everything else is a page
  const openCard = (key) => (key === 'peel' ? openPeel(null, 'home') : setPage(key));

  const home = () => setPage('home');

  switch (page) {
    case 'peel':
      return <PeelPractice initialExtractId={peelExtractId} onBack={() => setPage(peelBack)} />;
    case 'twelfth':
      return <TwelfthNight onBack={home} onOpen={(key) => (key === 'peel' ? openPeel(null, 'twelfth') : setPage(key))} />;
    case 'characters':
      return <Characters onBack={home} onPractise={(id) => openPeel(id, 'characters')} />;
    case 'symbolism':
      return <Symbolism onBack={home} onPractise={(id) => openPeel(id, 'symbolism')} />;
    case 'extracts':
      return <ExtractQuestions onBack={home} onPractise={(id) => openPeel(id, 'extracts')} />;
    default:
      return <EnglishHome studentName={studentName} onOpen={openCard} />;
  }
}
