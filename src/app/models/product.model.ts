export interface Category {
  id: string;
  name: string;
}

//Este es el modelo que necesito para renderizar y aprovechar el tipado
export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
}

//Este es el que necesito para mandar a la API para que me devuelva el objeto creado, me da la flexibilidad
// export interface CreateProductDTO {

//   title: string;
//   price: number;
//   images: string[];
//   description: string;
//   categoryId: number;
// }

export interface CreateProductDTO extends Omit<Product, 'id' | 'category'> {
  categoryId: number;
}

//Quiero lo mismo que cuando creo un producto, osea un CreateProductDTO pero sólo para alguna parte y que la interface no sea tan extricta, entonces uso el ? para indicar opcional, pero estamos repitiendo código
export interface UpdateProductDTO {
  title?: string;
  price?: number;
  images?: string[];
  description?: string;
  categoryId?: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  //el Partial le pone a todos los atributos el ?
}
