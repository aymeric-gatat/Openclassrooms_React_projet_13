const URL = "http://localhost:3001/api/v1";

export const getUser = async (token) => {
  const response = await fetch(URL + "/user/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Authentification échouée");
  }
  const data = await response.json();
  return data;
};

export const putUser = async (token, firstName, lastName) => {
  const response = await fetch(URL + "/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
    }),
  });
  if (!response.ok) {
    throw new Error("Modification échouée");
  }

  const data = await response.json();
  return data;
};
