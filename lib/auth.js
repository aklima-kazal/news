// app/login/page.jsx
onSubmit: async (values) => {
  const result = await loginUser(values.email, values.password);
  if (result.success) {
    toast.success("Logging in...");
    // Force Next.js to re-read cookies and update the layout
    window.location.href = "/dashboard";
  } else {
    toast.error(result.message);
  }
};
