import { supabase } from "@/lib/supabase";
import { Notas } from "../domain/nota.interface";

export async function getNotas(): Promise<Notas[]> {
    //leer todos los registros desde
    //la tabla de notas

    let { data, error } = await supabase
        .from('notes4b')
        .select('*')

    //si no hay datos, retorna un arreglo vacio
    return (data as Notas[]) || [];

}

export async function saveNote(note: Notas): Promise<Notas | null> {
    //si es nota nueva
    if (note.id === "0") {
        const { data, error } = await supabase
            .from('notes4b')
            .insert([
                {
                    title: note.title,
                    description: note.description,
                    date: note.date
                },
            ])
            .select()
        //si data no es un null, tomar el primer registro
        //o retomar null
        return data !== null ? data[0] : null;
    } else {
        //actualizar la nota
        //update notes4b set title ='aaa', description = 'aaa' where
        //id ='aaaaa'
        const { data, error } = await supabase
            .from('notes4b')
            .update({
                title: note.title,
                description: note.description,
            })
            .eq('id', note.id)
            .select()

        //si data no es un null, tomar el primer registro
        //o retomar null
        return data !== null ? data[0] : null;
    }
}
