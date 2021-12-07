'use strict';

import {openModal, closeModal} from './modal.js' 
import {getProdutos, postProduto, deleteProduto, editProduto} from './produtos.js'
import {imagemPreview} from './imagemPreview.js'

const criarLinha = ({nome, foto, categoria, preco, id}) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
    <td>
        <img src="${foto}" class="produto-image" />
    </td>
    <td>${nome}</td>
    <td>${preco}</td>
    <td>${categoria}</td>
    <td>
        <button type="button" class="button green" data-id="${id}">
            editar
        </button>
        <button type="button" class="button red" data-id="${id}">
            excluir
        </button>
    </td>`

    return linha;
}

const carregarProdutos = async() => {
    const container = document.querySelector('tbody')
    const produtos = await getProdutos();
    const linhas = produtos.map(criarLinha)
    container.replaceChildren(...linhas)
}

const handlePreview = () => imagemPreview('inputFile', 'imagePreview');

const salvarProduto = async() => {
    const produto = {
        nome: document.getElementById('product').value,
        preco: document.getElementById('price').value,
        categoria: document.getElementById('category').value,
        foto: document.getElementById('imagePreview').src
    }

    await postProduto(produto)
    closeModal();
    carregarProdutos();
}

const editarProduto = async() => {
    const produto = {
        id: target.dataset.id, 
        nome: document.getElementById('product').value,
        preco: document.getElementById('price').value,
        categoria: document.getElementById('category').value,
        foto: document.getElementById('imagePreview').src
    }

    const editar = document.getElementById('save')
    editar.textContent = 'Editar'
    editar.addEventListener('click', editProduto)
}

const handleClickTbody = async({target}) => {
    if(target.type === 'button') {
        const acao = target.textContent.trim();

        if(acao === 'excluir') {
            await deleteProduto(target.dataset.id);
            carregarProdutos();
        }
        else if(acao === 'editar') {
            openModal()

            editarProduto()
            
        }
    }
}

carregarProdutos();

// Eventos

document
    .getElementById('cadastrarCliente')
    .addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('cancel').addEventListener('click', closeModal);

document.getElementById('inputFile').addEventListener('change', handlePreview)

document.getElementById('save').addEventListener('click', salvarProduto)

document.querySelector('tbody').addEventListener('click', handleClickTbody)