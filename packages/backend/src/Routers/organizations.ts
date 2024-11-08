/**
 * Proyecto Final: Aplicación gestora de proyectos
 * Asignatura: Sistemas y Tecnologías Web
 * Grado en Ingeniería Informática
 * Universidad de La Laguna
 *
 * @author Pablo Rodríguez de la Rosa
 * @author Javier Almenara Herrera
 * @author Omar Suárez Doro
 * @version 1.0
 * @date 28/10/2024
 * @brief organizations.ts file that contains the routes for the organizations
 */

import Express from 'express';
import { Schema } from 'mongoose';
import jwtMiddleware from '../Middleware/authMiddleware.js';
import Project from '../Models/Project.js';
import { getUserofJWT } from '../Utils/CRUD-util-functions.js';
import User, { UserDocumentInterface } from '../Models/User.js';
import Organization, {OrganizationInterface, OrgMember } from '../Models/Organization.js';



export const organizationsRouter = Express.Router();


/**
 * This function checks if an organization exists
 * @param name The name of the organization
 * @returns the organization if it exists, null otherwise
 */
async function checkIfOrganizationExists(name: string) : Promise<OrganizationInterface | null> {
  return Organization.findOne({ name: name });
}



/**
 * @brief This endpoint is used create a new organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.post('/', jwtMiddleware, async (req, res) => {
  try {
    const { name, members } = req.body;

   // We need to check if the organization exists
    const organizationExists = await checkIfOrganizationExists(name);
    if (organizationExists) {
      res.status(409).json({ error: 'Organization already exists' });
      return;
    }
    
    // We need to search for each user in the database and get their ObjectId
    const membersWithObjectIds : UserDocumentInterface[] = await members.map(async (member : OrgMember) => {
      const foundUser = await User.findOne({ username: member.user });
      if (!foundUser) throw new Error(`User ${member.user} not found`);
      return {
        user: foundUser._id,
        role: member.role,
      };
    });
    
    /// No añadir ningún proyecto al inicio ---- SOLUCIONAR ESTO SI SE NECESITA
    const projects_: (typeof Project)[] = [];
    // Crear la nueva organización con los ObjectId de los usuarios
    const newOrganization = new Organization({
      name,
      members: membersWithObjectIds,
      projects_,
    });
    // Guardar la organización en la base de datos
    const savedOrganization = await newOrganization.save();
    res.status(201).json(savedOrganization);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear la organización' });
  }
});

/**
 * @brief This endpoint is used to get all organizations
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/', jwtMiddleware, async (req, res) => {
  try {
    /// Obtener el usuario del JWT
    if (!req.headers['authorization']) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }
    const user = await getUserofJWT(req.headers['authorization']);
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }
    const organizations = await Organization.find({ 'members.user': user._id });
    /// SOLO DEVOLVER LOS NOMBRES DE LAS ORGANIZACIONES --- CAMBIAR SI SE NECESITA
    res.status(200).json({
      result: 'Organizations found',
      organizations: organizations.map((organization) => organization.name),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'No se pudieron obtener las organizaciones' });
  }
});

/**
 * @brief This endpoint is used to delete an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.delete('/', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el nombre de la organización
    const { name: organizationName } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      res.status(404).send({
        error: 'Organization not found',
      });
      return;
    }

    // Comprobar si el usuario actual es administrador en la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (!member || member.role !== 'admin') {
      res.status(403).send({
        error: 'Forbidden',
      });
      return;
    }

    // Asegúrate de convertir cada ObjectId a una cadena
    const projectIds = organization.projects.map((projectId) =>
      projectId.toString(),
    );
    console.log(projectIds);

    // Eliminar todos los proyectos que están en la lista de IDs
    await Project.deleteMany({ _id: { $in: projectIds } });

    // Eliminar la organización
    await organization.deleteOne();

    // Responder con un mensaje de éxito
    res.status(200).json({ result: 'Organization deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar la organización' });
  }
});

/**
 * @brief This endpoint is used to get the members of an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/members', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el nombre de la organización
    const { name: organizationName } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      res.status(404).send({
        error: 'Organization not found',
      });
      return;
    }

    // Comprobar si el usuario actual es miembro de la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (!member) {
      res.status(403).send({
        error: 'Forbidden',
      });
      return;
    }

    // Responder solo con los nombres de los miembros de la organización --- CAMBIAR SI SE NECESITA
    res.status(200).json({
      result: 'Members found',
      members: await Promise.all(
        organization.members.map(async (member) => {
          const user = await User.findById(member.user); // Buscar el usuario por su ObjectId
          return user?.username;
        }),
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No se pudieron obtener los miembros de la organización',
    });
  }
});

/**
 * @brief This endpoint is used to add a new member to an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.post('/members', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener los datos del nuevo miembro a añadir
    const { name: organizationName, user: username, role } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      res.status(404).send({
        error: 'Organization not found',
      });
      return;
    }

    // Comprobar si el usuario actual es administrador en la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (!member || member.role !== 'admin') {
      res.status(403).send({
        error: 'Forbidden',
      });
      return;
    }

    // Buscar el usuario por nombre de usuario para obtener su ObjectId
    const foundUser = await User.findOne({ username }).lean();
    if (!foundUser) {
      res.status(404).json({ error: `User ${username} not found` });
      return;
    }

    // Añadir el nuevo miembro a la organización
    organization.members.push({
      user: foundUser._id as Schema.Types.ObjectId,
      role,
    });
    await organization.save();

    // Responder con la organización actualizada
    res.status(201).json(organization);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'No se pudo añadir el miembro a la organización' });
  }
});

/**
 * @brief This endpoint is used to delete a member from an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.delete('/members', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener los datos del miembro a eliminar
    const { name: organizationName, user: username } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      res.status(404).send({
        error: 'Organization not found',
      });
      return;
    }

    // Comprobar si el usuario actual es administrador en la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (!member || member.role !== 'admin') {
      res.status(403).send({
        error: 'Forbidden',
      });
      return;
    }

    // Buscar el usuario por nombre de usuario para obtener su ObjectId
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      res.status(404).json({ error: `User ${username} not found` });
      return;
    }

    // Eliminar el miembro de la organización
    organization.members = organization.members.filter(
      (member) =>
        member.user.toString() !==
        (foundUser._id as Schema.Types.ObjectId).toString(),
    );
    await organization.save();

    // Responder con la organización eliminanda
    res.status(200).json(organization);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'No se pudo eliminar el miembro de la organización' });
  }
});

/**
 * @brief This endpoint is used to get all projects of an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.get('/projects', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      res.status(401).send({
        error: 'Unauthorized',
      });
      return;
    }

    // Obtener el nombre de la organización
    const { name: organizationName } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      res.status(404).send({
        error: 'Organization not found',
      });
      return;
    }

    // Comprobar si el usuario actual es miembro de la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (!member) {
      res.status(403).send({
        error: 'Forbidden',
      });
      return;
    }

    // Responder solo con los nombres de los proyectos de la organización --- CAMBIAR SI SE NECESITA
    res.status(200).json({
      result: 'Projects found',
      projects: await Promise.all(
        organization.projects.map(async (projectId) => {
          const project = await Project.findById(projectId); // Buscar el proyecto por su ObjectId
          return project?.name;
        }),
      ),
    });
  } catch (error) {
    res.status(500).json({
      error: 'No se pudieron obtener los proyectos de la organización',
    });
  }
});

/**
 * @brief This endpoint is used to add a project to an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.post('/projects', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    // Obtener los datos del proyecto y la organización
    const { name: organizationName, project: projectName } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      return res.status(404).send({
        error: 'Organization not found',
      });
    }

    // Comprobar si el usuario actual es administrador en la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    console.log(member);
    if (!member || member.role !== 'admin') {
      return res.status(403).send({
        error: 'Forbidden',
      });
    }

    // Buscar todos los proyectos que coincidan con el nombre proporcionado
    const projects = await Project.find({ name: projectName });
    if (!projects.length) {
      return res.status(404).send({
        error: 'Project not found',
      });
    }

    // Verificar si el usuario es miembro de alguno de los proyectos encontrados
    const project = projects.find((p) =>
      p.users.some((u) => u.user.toString() === user._id.toString()),
    );
    if (!project) {
      return res.status(403).send({
        error: 'Forbidden: You are not a member of any matching projects',
      });
    }
    console.log(project);

    // Verificar si el proyecto ya está en la organización
    const projectInOrganization = organization.projects.some(
      (p) => p.toString() === (project._id as Schema.Types.ObjectId).toString(),
    );
    if (projectInOrganization) {
      return res.status(409).send({
        error: 'Project already in organization',
      });
    }

    // Añadir el proyecto a la organización
    organization.projects.push(project._id as Schema.Types.ObjectId);
    await organization.save();

    // Responder con la organización actualizada
    return res.status(201).json({
      result: 'Project added to organization',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'No se pudo añadir el proyecto a la organización' });
  }
});

/**
 * @brief This endpoint is used to delete a project from an organization
 * @param req The request object
 * @param res The response object
 * @returns void
 */
organizationsRouter.delete('/projects', jwtMiddleware, async (req, res) => {
  try {
    // Verificar si el token de autorización está presente
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    // Obtener el usuario del JWT
    const user = (await getUserofJWT(authorizationHeader)) as { _id: string };
    if (!user) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    // Obtener los datos del proyecto y la organización
    const { name: organizationName, project: projectName } = req.body;

    // Buscar la organización por nombre
    const organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      return res.status(404).send({
        error: 'Organization not found',
      });
    }

    // Comprobar si el usuario actual es administrador en la organización
    const member = organization.members.find(
      (member) => member.user.toString() === user._id.toString(),
    );
    if (!member || member.role !== 'admin') {
      return res.status(403).send({
        error: 'Forbidden',
      });
    }

    // Buscar los proyectos por nombre (puede haber varios con el mismo nombre)
    const projects = await Project.find({ name: projectName });
    if (!projects || projects.length === 0) {
      return res.status(404).send({
        error: 'Project not found',
      });
    }

    // Comprobar que el usuario esté en al menos uno de los proyectos
    const project = projects.find((p) =>
      p.users.some((u) => u.user.toString() === user._id.toString()),
    );
    if (!project) {
      return res.status(403).send({
        error: 'Forbidden: You are not a member of any matching projects',
      });
    }

    // Comprobar si el proyecto está en la lista de proyectos de la organización
    const projectInOrganization = organization.projects.some(
      (p) => p.toString() === (project._id as Schema.Types.ObjectId).toString(),
    );
    if (!projectInOrganization) {
      return res.status(404).send({
        error: 'Project not in organization',
      });
    }

    // Eliminar el proyecto de la organización
    organization.projects = organization.projects.filter(
      (p) => p.toString() !== (project._id as Schema.Types.ObjectId).toString(),
    );
    await organization.save();

    // Responder con un mensaje de éxito
    return res.status(200).json({
      message: 'Project removed from organization',
    });
  } catch (error) {
    console.error('Error deleting project from organization:', error);
    return res
      .status(500)
      .json({ error: 'No se pudo eliminar el proyecto de la organización' });
  }
});
