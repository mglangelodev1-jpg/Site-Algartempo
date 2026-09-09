const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

function showError(text) {
  message.textContent = text;
  message.className = "message error";
}

async function checkExistingSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    return;
  }

  await checkAdmin(data.session.user.id);
}

async function checkAdmin(userId) {
  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    await supabaseClient.auth.signOut();
    showError("Este utilizador não tem acesso ao backoffice.");
    return;
  }

  window.location.href = "admin-feiras.html";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginButton.disabled = true;
  loginButton.textContent = "A ENTRAR...";
  message.className = "message";
  message.textContent = "";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showError("Email ou password incorretos.");
    loginButton.disabled = false;
    loginButton.textContent = "ENTRAR";
    return;
  }

  await checkAdmin(data.user.id);

  loginButton.disabled = false;
  loginButton.textContent = "ENTRAR";
});

checkExistingSession();