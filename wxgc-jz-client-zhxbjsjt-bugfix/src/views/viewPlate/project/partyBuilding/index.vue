<template>
  <div style="height: calc(100% - 20px);">
    <div class="container">
      <organization-members class="members" ></organization-members>
      <party-activity class="activity "></party-activity>
      <study-practice class="practice " ></study-practice>
    </div>
  </div>
</template>

<script>
  // import combox from "../../components/combox";
  import OrganizationMembers from "./organizationMembers";
  import StudyPractice from "./studyPractice";
  import PartyActivity from "./partyActivity";
  export default {
    name: "index",
    components: {
      PartyActivity,
      StudyPractice,
      OrganizationMembers
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 400px minmax(800px, 1fr);
    grid-template-rows: minmax(300px, 1fr) 3fr;
    grid-gap: 20px;
  }

  .members {
    margin-bottom: 0;
  }

  .practice {
    overflow-y: hidden;
    margin-bottom: 0;
  }

  .activity {
    margin-bottom: 0;
    grid-column: 2/3;
    grid-row: 1/3;
  }
</style>
