import Joi from "@hapi/joi";

const emailRules = Joi.string()
  .lowercase()
  .email({
    // n@n.tld
    minDomainSegments: 2,
    allowUnicode: false,
    tlds: { allow: ["com", "net", "edu"] }
  })
  .required();

const passwordRules = Joi.string().required();

const loginValidation = Joi.object({
  email: emailRules,
  password: passwordRules
});
const registrationValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: emailRules,
  //TODO: this is temporary!
  password: passwordRules.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});

export { loginValidation, registrationValidation };
