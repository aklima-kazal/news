onSubmit: async (values) => {
  const result = await loginUser(values.email, values.password);

  if (result.success) {
    toast.success("Login Successful!");

    // ✅ USE THIS instead of router.push for auth redirects
    // It forces a full page sync so the layout sees the new cookie
    window.location.href = "/dashboard";
  } else {
    toast.error(result.message);
  }
};
