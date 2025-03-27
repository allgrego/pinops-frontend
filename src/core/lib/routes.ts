// /**
//  * Helpers related to Next.js and others routes handling
//  *
//  * @author Gregorio Alvarez <galvarez@cbpi.com.mx>
//  *
//  */

// import { RouteAlias, routes } from "@/core/setup/routes";

// /**
//  * Get a route from an ALIAS with parameters if any.
//  *
//  * For example, from getRoute('api-get-cities',[123,456]) you get "/api/geodata/countries/123/states/456/cities"
//  *
//  * @author Gregorio Alvarez <galvarez@cbpi.com.mx>
//  *
//  * @param {RouteAlias} routeAlias Alias of route according to routes declared above
//  * @param {(string | number)[]} parameters array of values to be replaced if route has wildcard (order is important)
//  *
//  * @return {string} resulting route
//  */
// export const getRoute = (
//   routeAlias: RouteAlias,
//   parameters?: (string | number)[]
// ): string => {
//   const index = Object.keys(routes).find((key) => routeAlias === key) as
//     | RouteAlias
//     | undefined;

//   if (!index) throw new Error(`Invalid route alias: ${routeAlias}`);

//   let path = routes[index];

//   const matches = Array.from(path.matchAll(/(\/:\w+)/gim));

//   if (!matches || !parameters) return path;

//   const wildcards = matches.map((matchDetails) => matchDetails[0]);

//   if (wildcards.length > parameters.length) {
//     console.error(
//       `Missing parameters for route "${path}". Alias: "${routeAlias}". Provided parameters: [${parameters.join(
//         ","
//       )}]`
//     );
//   }

//   wildcards.forEach((wildcard, index) => {
//     if (!parameters[index]) return;
//     path = path.replace(wildcard, `/${String(parameters[index])}`);
//   });

//   return path;
// };
