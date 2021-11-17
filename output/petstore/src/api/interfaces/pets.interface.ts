interface IPetsController {



  /**
  * List all pets
  */

  public async getlistPets(request: Request, toolkit: ResponseToolkit);

  /**
  * Create a pet
  */

  public async postcreatePets(request: Request, toolkit: ResponseToolkit);

  /**
  * Info for a specific pet
  */

  public async getshowPetById(request: Request, toolkit: ResponseToolkit);

}

export { IPetsController }
