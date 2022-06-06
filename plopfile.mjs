export default function (plop) {
  plop.load("plop-action-eslint")

  plop.setGenerator("Resource", {
    description: "Generate new resource",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Resource name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.contract.ts",
        templateFile: "plop-templates/contract.hbs",
      },
      {
        type: "add",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.controller.ts",
        templateFile: "plop-templates/controller.hbs",
      },
      {
        type: "add",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.dto.ts",
        templateFile: "plop-templates/dto.hbs",
      },
      // TODO: Add this when needed
      // {
      //   type: "add",
      //   path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.model.ts",
      //   templateFile: "plop-templates/model.hbs",
      // },
      {
        type: "add",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.module.ts",
        templateFile: "plop-templates/module.hbs",
      },
      {
        type: "add",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.service.ts",
        templateFile: "plop-templates/service.hbs",
      },
      {
        type: "add",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.utils.ts",
        templateFile: "plop-templates/utils.hbs",
      },
      {
        type: "eslint",
        path: "src/resources/{{pascalCase name}}/{{kebabCase name}}.*.ts",
      },
    ],
  })
}
