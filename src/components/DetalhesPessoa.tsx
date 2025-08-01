"use client";
import Image from 'next/image';
import { PessoaDesaparecida } from '@/types/localizacao';
import Link from 'next/link';

interface Props {
  pessoa: PessoaDesaparecida | null;
  onClose: () => void;
  onCompartilhar: () => void;
}

export default function DetalhesPessoa({ 
  pessoa, 
  onClose,  
  onCompartilhar 
}: Props) {
  if (!pessoa) return null;

  return (
    <section className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <section className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Detalhes da Pessoa Desaparecida</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar detalhes"
          title="Fechar detalhes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-1">
          <section className="bg-gray-100 p-4 text-[#000] rounded-lg flex justify-center">
            {pessoa.foto ? (
              <Image 
                src={pessoa.foto} 
                alt={pessoa.nome}
                width={128}
                height={128}
                className="h-32 w-32 object-cover rounded-lg"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-black-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </section>
        </section>
        
        <section className="md:col-span-2">
          <h3 className="text-xl font-semibold text-[#000]">{pessoa.nome}</h3>
          <section className="grid grid-cols-2 gap-4 mt-3">
            <section>
              <p className="text-sm  text-[#000]">Idade</p>
              <p className="font-medium text-[#000]">{pessoa.idade} anos</p>
            </section>
            <section>
              <p className="text-sm  text-[#000]">Desaparecido desde</p>
              <p className="font-medium  text-[#000]">
                {new Date(pessoa.desaparecidoDesde).toLocaleDateString()}
              </p>
            </section>
            <section>
              <p className="text-sm  text-[#000]">Último avistamento</p>
              <p className="font-medium  text-[#000]">
                {pessoa.ultimoAvistamento 
                  ? new Date(pessoa.ultimoAvistamento).toLocaleDateString() 
                  : 'Desconhecido'
                }
              </p>
            </section>
            <section>
              <p className="text-sm  text-[#000]">Contato</p>
              <p className="font-medium  text-[#000]">{pessoa.contato}</p>
            </section>
          </section>
          
          <section className="mt-4">
            <p className="text-sm  text-[#000]">Descrição</p>
            <p className="mt-1  text-[#000]">{pessoa.descricao}</p>
          </section>
          
          <section className="mt-4 flex space-x-3">
            <Link href="/avistamentos">
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Reportar avistamento
              </button>
            </Link>
            
            <button 
              onClick={onCompartilhar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
            >
              Compartilhar
            </button>
          </section>
        </section>
      </section>
    </section>
  );
} 