import supabase from "./supabase";
import { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //create/edit cabin
  let query = supabase.from("cabins");

  //create cabin
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  //edit cabin
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }
  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new error("Cabin could not be created");
  }

  //upload image
  if (hasImagePath) {
    return data;
  }
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  //delete the cabin if there was an error uploading the image

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  //delete image

  //get image path

  let { data: cabins, error: fetchError } = await supabase
    .from("cabins")
    .select("*");

  const cabin = cabins.find((cabin) => cabin.id === id);

  const imagePath = cabin.image;

  const cabinsWithSameImage = cabins.filter(
    (cabin) => cabin.image === imagePath
  );

  if (cabinsWithSameImage.length === 1) {
    const imageName = cabin.image.split("/").pop();

    const { error: deleteImageError } = await supabase.storage
      .from("cabin-images")
      .remove([imageName]);

    if (deleteImageError) {
      console.error(deleteImageError);
      throw new deleteImageError("Cabin could not be deleted");
    }
  }

  //delete cabin
  const { error: deleteCabinError } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);

  if (fetchError) {
    console.error(fetchError);
    throw new fetchError("Cabin image could not be deleted");
  }

  if (deleteCabinError) {
    console.error(deleteCabinError);
    throw new deleteCabinError("Cabin could not be deleted");
  }
}
