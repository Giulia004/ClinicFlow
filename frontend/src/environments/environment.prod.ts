const currentHost = window.location.hostname;
export const environment = {
  production: true,
  apiUrl:`http://${currentHost}:3000/api`
};
