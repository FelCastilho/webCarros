import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelHeader";

import { FiUpload } from "react-icons/fi";
import {useForm} from 'react-hook-form';
import { Input } from "../../../components/input";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthContext } from "../../../contexts/auth";
import { storage } from "../../../services/firebaseConnection";

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { v4 as uuidV4 } from 'uuid';

 
const schema = z.object({
  name: z.string().min(4, 'O campo nome não pode ser vazio'),
  model: z.string().min(1, 'O campo modelo é obrigatório!'),
  year: z.string().min(1, 'O ano do carro é obrigatório!'),
  km: z.string().min(1, 'O KM do carro é obrigatório!'),
  price: z.string().min(1, 'O preço do carro é obrigatório!'),
  city: z.string().min(1, 'A cidade é obrigatório!'),
  whatsapp: z.string().min(1, 'O telefone é obrigatório!').refine((value) => /^(\d{10,12})$/.test(value), {
    message: 'Número de telefone inválido!'
  }),
  description: z.string().min(1, 'A descrição do carro é obrigatório!'),
})

type FormData = z.infer<typeof schema>

export function New(){

  const { user } = useContext(AuthContext);

  const { register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  function onSubmit(data: FormData){
    console.log(data);
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        //Enviar para o banco a imagem
        await handleUpload(image);
      }else{
        alert('Envie uma imagem jpeg ou png')
        return;
      }
    }
  }

  async function handleUpload(image: File){

    //Caso nao tenha um usuario
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    //Caminho para salvar no banco

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        console.log(downloadUrl);
      })
    })

  }

    return(
      <Container>
        <DashboardHeader/>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">

          <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">

            <div className="position absolute cursor-pointer">
              <FiUpload size={30} color="#000"/>
            </div>

            <div className="cursor-pointer">
              <input type="file" accept="image" className="opacity-0 cursor-pointer" 
              onChange={handleFile}/>
            </div>

          </button> 

        </div>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
          <form 
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3">
              <p className="mb-2 font-medium">Nome do carro</p>
              <Input
              type="text"
              register={register}
              name='name'
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0...."
              />
            </div>

            <div className="mb-3">
              <p className="mb-2 font-medium">Modelo do carro</p>
              <Input
              type="text"
              register={register}
              name='model'
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex Plus"
              />
            </div>

            <div className="flex w-full mb-3 flex-row items-center gap-4"> 
              <div className="w-full">
                <p className="mb-2 font-medium">Ano</p>
                <Input
                type="text"
                register={register}
                name='year'
                error={errors.year?.message}
                placeholder="Ex: 2007/2007"
                />
              </div>

              <div className="w-full">
                <p className="mb-2 font-medium">KM rodados</p>
                <Input
                type="text"
                register={register}
                name='km'
                error={errors.km?.message}
                placeholder="Ex: 23.000..."
                />
              </div>

            </div>

            <div className="flex w-full mb-3 flex-row items-center gap-4"> 
              <div className="w-full">
                <p className="mb-2 font-medium">Telefone / WhatsApp</p>
                <Input
                type="text"
                register={register}
                name='whatsapp'
                error={errors.whatsapp?.message}
                placeholder="Ex: 981610033"
                />
              </div>

              <div className="w-full">
                <p className="mb-2 font-medium">Cidade</p>
                <Input
                type="text"
                register={register}
                name='city'
                error={errors.city?.message}
                placeholder="Ex: São Gonçalo - RJ"
                />
              </div>

            </div>

            <div className="mb-3">
              <p className="mb-2 font-medium">Preço</p>
              <Input
              type="text"
              register={register}
              name='price'
              error={errors.price?.message}
              placeholder="Ex: 69.000"
              />
            </div>

            <div className="mb-3">

              <p className="mb-2 font-medium">Descrição</p>
              <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register('description')}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro"
              >
                {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
              </textarea>
            </div>

            <button type="submit" className="rounded-md bg-zinc-900 text-white font-medium w-full h-10">
                Cadastrar
            </button>

          </form>

        </div>

      </Container>
    )
  }